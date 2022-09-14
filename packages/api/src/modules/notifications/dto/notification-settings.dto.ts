import { DtoProperty } from '../../../web/dto.web'

export class NotificationSettingsDto {
  @DtoProperty({ optional: true })
  directMessageEmails?: boolean

  @DtoProperty({ optional: true })
  passesEmails?: boolean

  @DtoProperty({ optional: true })
  paymentEmails?: boolean

  @DtoProperty({ optional: true })
  postEmails?: boolean

  @DtoProperty({ optional: true })
  marketingEmails?: boolean

  @DtoProperty({ optional: true })
  mentionEmails?: boolean

  constructor(notificationSettings) {
    if (notificationSettings) {
      this.directMessageEmails = notificationSettings.direct_message_emails
      this.passesEmails = notificationSettings.passes_emails
      this.paymentEmails = notificationSettings.payment_emails
      this.postEmails = notificationSettings.post_emails
      this.marketingEmails = notificationSettings.marketing_emails
    }
  }
}
