import { DtoProperty } from '../../../web/dto.web'
import { NotificationSettingsEntity } from '../entities/notification-settings.entity'

export class NotificationSettingsDto {
  @DtoProperty({ type: 'boolean' })
  directMessageEmails: boolean

  @DtoProperty({ type: 'boolean' })
  passesEmails: boolean

  @DtoProperty({ type: 'boolean' })
  paymentEmails: boolean

  @DtoProperty({ type: 'boolean' })
  postEmails: boolean

  @DtoProperty({ type: 'boolean' })
  marketingEmails: boolean

  @DtoProperty({ type: 'boolean' })
  mentionEmails: boolean

  constructor(notificationSettings: NotificationSettingsEntity | undefined) {
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
