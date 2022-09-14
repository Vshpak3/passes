import { IsEnum, IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
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

  @IsEnum(CirclePaymentStatusEnum)
  @DtoProperty({ enum: CirclePaymentStatusEnum })
  status: CirclePaymentStatusEnum

  @IsUUID()
  @DtoProperty()
  merchantId: string

  @IsUUID()
  @DtoProperty()
  merchantWalletId: string

  @DtoProperty({ optional: true })
  description?: string
}
