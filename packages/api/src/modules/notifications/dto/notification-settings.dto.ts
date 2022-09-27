import { DtoProperty } from '../../../web/dto.web'

export class NotificationSettingsDto {
  @DtoProperty({ type: 'boolean', optional: true })
  directMessageEmails?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  passesEmails?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  paymentEmails?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  postEmails?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  marketingEmails?: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  mentionEmails?: boolean

  constructor(notificationSettings) {
    if (notificationSettings) {
      this.directMessageEmails = notificationSettings.direct_message_emails
      this.passesEmails = notificationSettings.passes_emails
      this.paymentEmails = notificationSettings.payment_emails
      this.postEmails = notificationSettings.post_emails
      this.marketingEmails = notificationSettings.marketing_emails
      this.mentionEmails = notificationSettings.mention_emails
    }
  }
}
