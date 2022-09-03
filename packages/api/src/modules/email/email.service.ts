import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import Maizzle from '@maizzle/framework'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { getAwsConfig } from '../../util/aws.util'
import { UserEntity } from '../user/entities/user.entity'
import { EMAIL_ALREADY_VERIFIED, USER_NOT_EMAIL } from './constants/errors'
import { VerifyEmailRequestEntity } from './entities/verify-email-request.entity'
import { CONFIRM_EMAIL_TEMPLATE } from './templates/confirm-email'
import { CONFIRM_PASSWORD_RESET_EMAIL } from './templates/confirm-password-reset'

// 1 hour
export const VERIFY_EMAIL_LIFETIME = 1 * (60 * 60 * 1000)

// 1 hour
export const RESET_PASSWORD_EMAIL_LIFETIME = 1 * (60 * 60 * 1000)

@Injectable()
export class EmailService {
  private sesClient: SESClient

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {
    this.sesClient = new SESClient(getAwsConfig(configService))
  }

  private async sendEmail(
    recipient: string,
    messageHtml: string,
    subject: string,
  ) {
    const command = new SendEmailCommand({
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
      Source: this.configService.get('ses.senderEmail'),
    })

    await this.sesClient.send(command)
  }

  async sendVerifyEmail(userId: string) {
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()

    if (!user || user.oauth_provider !== null) {
      throw new BadRequestException(USER_NOT_EMAIL)
    }

    if (user.is_email_verified) {
      throw new BadRequestException(EMAIL_ALREADY_VERIFIED)
    }

    const id = v4()
    await this.dbWriter(VerifyEmailRequestEntity.table).insert(
      {
        id,
        user_id: userId,
        expiresAt: new Date(Date.now() + VERIFY_EMAIL_LIFETIME),
      },
      '*',
    )

    const verificationLink = `${this.configService.get(
      'clientUrl',
    )}/email/verify?id=${id}`

    const { html } = await Maizzle.render(CONFIRM_EMAIL_TEMPLATE, {
      maizzle: { email: user.email_address, verifyEmailUrl: verificationLink },
    })

    await this.sendEmail(user.email_address, html, '[Passes] Verify Email')
  }

  async sendInitResetPassword(email: string) {
    const user = await this.dbReader(UserEntity.table).where({ email }).first()

    if (!user || user.oauth_provider !== null) {
      throw new BadRequestException(USER_NOT_EMAIL)
    }

    if (user.is_email_verified) {
      throw new BadRequestException(EMAIL_ALREADY_VERIFIED)
    }

    const id = v4()
    await this.dbWriter(VerifyEmailRequestEntity.table).insert(
      {
        id,
        user_id: user.id,
        expiresAt: new Date(Date.now() + RESET_PASSWORD_EMAIL_LIFETIME),
      },
      '*',
    )

    const passwordResetLink = `${this.configService.get(
      'clientUrl',
    )}/password-reset?token=${id}`

    const { html } = await Maizzle.render(CONFIRM_EMAIL_TEMPLATE, {
      maizzle: { email: user.email_address, passwordResetLink },
    })

    await this.sendEmail(user.email_address, html, '[Passes] Reset Email')
  }

  async sendConfirmResetPasswordEmail(userId: string) {
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()

    if (!user || user.oauth_provider !== null) {
      throw new BadRequestException(USER_NOT_EMAIL)
    }

    const { html } = await Maizzle.render(CONFIRM_PASSWORD_RESET_EMAIL, {
      maizzle: { email: user.email_address, display_name: user.display_name },
    })

    await this.sendEmail(
      user.email_address,
      html,
      '[Passes] Password Reset Successful',
    )
  }
}
