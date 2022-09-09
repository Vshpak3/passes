import { DtoProperty } from '../../../web/dto.web'

export class NotificationSettingsDto {
  @DtoProperty({ required: false })
  directMessageEmails?: boolean

  @DtoProperty({ required: false })
  passesEmails?: boolean

  @DtoProperty({ required: false })
  paymentEmails?: boolean

  @DtoProperty({ required: false })
  postEmails?: boolean

  @DtoProperty({ required: false })
  marketingEmails?: boolean

  @DtoProperty({ required: false })
  mentionEmails?: boolean

  constructor(notificationSettings) {
    this.directMessageEmails = notificationSettings.direct_message_emails
    this.passesEmails = notificationSettings.passes_emails
    this.paymentEmails = notificationSettings.payment_emails
    this.postEmails = notificationSettings.post_emails
    this.marketingEmails = notificationSettings.marketing_emails
  }
}
