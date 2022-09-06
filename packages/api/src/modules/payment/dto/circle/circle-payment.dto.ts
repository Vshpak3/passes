import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/endpoint.web'
import { CirclePaymentStatusEnum } from '../../enum/circle-payment.status.enum'
import { CircleAmountDto, CircleSourceDto } from './circle-utils.dto'

export class CirclePaymentDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  type: string

  @DtoProperty()
  amount: CircleAmountDto

  @DtoProperty()
  source: CircleSourceDto

  @DtoProperty({ enum: CirclePaymentStatusEnum })
  status: CirclePaymentStatusEnum

  @IsUUID()
  @DtoProperty()
  merchantId: string

  @IsUUID()
  @DtoProperty()
  merchantWalletId: string

  @DtoProperty({ required: false })
  description?: string
}
