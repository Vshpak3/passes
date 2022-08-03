import { ApiProperty } from '@nestjs/swagger'

import { PayinMethodEnum } from '../enum/payin.enum'

export class RegisterPaymentResponse {
  @ApiProperty()
  paymentId: string
  @ApiProperty({ enum: PayinMethodEnum })
  method: PayinMethodEnum
}
