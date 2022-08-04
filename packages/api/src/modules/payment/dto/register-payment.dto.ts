import { ApiProperty } from '@nestjs/swagger'

import { PayinMethodEnum } from '../enum/payin.enum'
import { PaymentCallbackEnum } from '../enum/payment.callback.enum'

export class RegisterPaymentResponseDto {
  @ApiProperty()
  paymentId: string

  @ApiProperty({ enum: PayinMethodEnum })
  method: PayinMethodEnum
}
export class RegisterPaymentRequestDto {
  @ApiProperty()
  userId: string

  @ApiProperty()
  amount: number

  @ApiProperty({ enum: PaymentCallbackEnum })
  callback: PaymentCallbackEnum

  @ApiProperty()
  callbackInputJSON: string
}
