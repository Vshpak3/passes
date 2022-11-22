import { DtoProperty } from '../../../web/dto.web'
import { PaymentNotificationEnum } from '../enum/payment.notification.enum'

export class PaymentNotificationDto {
  @DtoProperty({ custom_type: PaymentNotificationEnum })
  notification: PaymentNotificationEnum

  @DtoProperty({ type: 'string' })
  receiverId: string
}
