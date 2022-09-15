import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { CircleChargebackTypeEnum } from '../../enum/circle-chargeback.type.enum'
import { CircleAmountDto } from './circle-utils.dto'

export class CircleChargebackSettlementDto {
  @DtoProperty({ enum: CircleChargebackTypeEnum })
  type: CircleChargebackTypeEnum

  @DtoProperty()
  chargebackAmount: CircleAmountDto

  @DtoProperty()
  fee: CircleAmountDto

  @DtoProperty()
  description: string

  @IsUUID()
  @DtoProperty()
  settlementId: string
}

export class CircleChargebackDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  paymentId: string

  @DtoProperty({ type: [CircleChargebackSettlementDto] })
  history: CircleChargebackSettlementDto[]
}
