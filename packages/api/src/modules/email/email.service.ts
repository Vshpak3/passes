import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import Maizzle from '@maizzle/framework'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { getAwsConfig } from '../../util/aws.util'
import maizzleConfig from './config'
import tailwindConfig from './tailwindConfig'

@Injectable()
export class EmailService {
  private senderName: string
  private senderEmail: string
  private sesClient: SESClient
  private maizzleConfig: Record<string, any>

  constructor(private readonly configService: ConfigService) {
    this.senderName =
      this.configService.get('infra.env') === 'prod'
        ? 'Passes'
        : 'Passes Staging'

    this.senderEmail = this.configService.get('ses.senderEmail') as string
    this.sesClient = new SESClient(getAwsConfig(configService))

    this.maizzleConfig = {
      ...maizzleConfig,
      logoUrl: `${this.configService.get(
        'cloudfront.baseUrl',
      )}/assets/logo_color_200x200.png`,
    }
  }

  async sendRenderedEmail(
    email: string,
    subject: string,
    template: string,
    data: Record<any, any>,
  ) {
    const { html } = await Maizzle.render(template, {
      tailwind: { config: tailwindConfig },
      maizzle: { ...this.maizzleConfig, ...data },
    })
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
}
