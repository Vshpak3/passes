import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import Maizzle from '@maizzle/framework'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { getAwsConfig } from '../../util/aws.util'
import { TagDto } from '../../util/dto/tag.dto'
import { isEnv } from '../../util/env'
import { NotificationSettingsEntity } from '../notifications/entities/notification-settings.entity'
import { UserEntity } from '../user/entities/user.entity'
import maizzleConfig from './config'
import tailwindConfig from './tailwindConfig'
import {
  POST_NEW_MENTION,
  POST_NEW_MENTION_EMAIL_SUBJECT,
} from './templates/post-new-mention'

type EmailType = keyof Omit<NotificationSettingsEntity, 'userId'>
@Injectable()
export class EmailService {
  private senderName: string
  private senderEmail: string
  private sesClient: SESClient
  private maizzleConfig: Record<string, any>

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
    private readonly configService: ConfigService,

    @InjectSentry() private readonly sentry: SentryService,
  ) {
    this.senderName = isEnv('prod') ? 'Passes' : 'Passes Staging'

    this.senderEmail = this.configService.get('ses.senderEmail') as string
    this.sesClient = new SESClient(getAwsConfig(configService))

    this.maizzleConfig = {
      ...maizzleConfig,
      logoUrl: `${this.configService.get(
        'cloudfront.baseUrl',
      )}/assets/logo_color_200x200.png`,
    }
  }

  async renderEmail(template: string, data: Record<any, any>): Promise<string> {
    const { html } = await Maizzle.render(template, {
      tailwind: { config: tailwindConfig },
      maizzle: { ...this.maizzleConfig, ...data },
    })
    return html
  }

  async sendRenderedEmail(
    email: string,
    subject: string,
    template: string,
    data: Record<any, any>,
  ) {
    const html = await this.renderEmail(template, data)
    await this.sendEmail(email, html, subject)
  }

  async sendEmail(recipient: string, messageHtml: string, subject: string) {
    await this.sesClient.send(
      new SendEmailCommand({
        Destination: {
          ToAddresses: [recipient],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: messageHtml,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
        Source: `${this.senderName} <${this.senderEmail}>`,
      }),
    )
  }

  // don't stop normal execution if email fails
  async sendEmailToUsers(
    userIds: string[],
    messageHtml: string,
    subject: string,
    data: Record<any, any>,
    type: EmailType,
  ) {
    try {
      const users = await this.dbReader<UserEntity>(UserEntity.table)
        .leftJoin(
          NotificationSettingsEntity.table,
          `${NotificationSettingsEntity.table}.user_id`,
          `${UserEntity.table}.id`,
        )
        .whereIn(`${UserEntity.table}.id`, userIds)
        .andWhere(`${NotificationSettingsEntity.table}.${type}`, true)
        .select(`${UserEntity.table}.email`)
      await Promise.all(
        users.map(async (user) => {
          await this.sendRenderedEmail(user.email, messageHtml, subject, {
            data,
          })
        }),
      )
    } catch (err) {
      this.sentry.instance().captureException(err)
      this.logger.error(
        'Failed to send email notifications to users mentioned in post',
      )
    }
  }

  async sendEmailToUser(
    userId: string,
    messageHtml: string,
    subject: string,
    data: Record<any, any>,
    type: EmailType,
  ) {
    return this.sendEmailToUsers([userId], messageHtml, subject, data, type)
  }

  async sendTaggedUserEmails(tags: TagDto[]) {
    await this.sendEmailToUsers(
      tags.map((u) => u.userId),
      POST_NEW_MENTION_EMAIL_SUBJECT,
      POST_NEW_MENTION,
      {},
      'mention_emails',
    )
  }
}
