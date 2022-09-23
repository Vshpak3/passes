import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import Maizzle from '@maizzle/framework'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { getAwsConfig } from '../../util/aws.util'
import maizzleConfig from './config'
import tailwindConfig from './tailwindConfig'

@Injectable()
export class EmailService {
  private senderEmail: string
  private sesClient: SESClient

  constructor(private readonly configService: ConfigService) {
    this.senderEmail = this.configService.get('ses.senderEmail') as string
    this.sesClient = new SESClient(getAwsConfig(configService))
  }

  async sendRenderedEmail(
    email: string,
    subject: string,
    template: string,
    data: Record<any, any>,
  ) {
    const { html } = await Maizzle.render(template, {
      tailwind: { config: tailwindConfig },
      maizzle: {
        ...data,
        logoUrl: this.configService.get('ses.logoUrl') as string,
        ...maizzleConfig,
      },
    })
    await this.sendEmail(email, html, subject)
  }

  async sendEmail(recipient: string, messageHtml: string, subject: string) {
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
      Source: this.senderEmail,
    })

    await this.sesClient.send(command)
  }
}
