import { ApiProperty } from '@nestjs/swagger'

import { PaymentDto } from './payment.dto'

export class CircleNotificationDto {
  @ApiProperty()
  clientId: string
  @ApiProperty()
  notificationType: string
  @ApiProperty()
  version: number
}

export class CirclePaymentNotificationDto extends CircleNotificationDto {
  @ApiProperty()
  payment: PaymentDto
}
