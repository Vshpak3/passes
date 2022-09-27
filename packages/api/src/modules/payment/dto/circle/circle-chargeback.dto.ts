import { DtoProperty } from '../../../../web/dto.web'
import { CircleChargebackTypeEnum } from '../../enum/circle-chargeback.type.enum'
import { CircleAmountDto } from './circle-utils.dto'

export class CircleChargebackSettlementDto {
  @DtoProperty({ custom_type: CircleChargebackTypeEnum })
  type: CircleChargebackTypeEnum

  @DtoProperty({ custom_type: CircleAmountDto })
  chargebackAmount: CircleAmountDto

  @DtoProperty({ custom_type: CircleAmountDto })
  fee: CircleAmountDto

  @DtoProperty({ type: 'string' })
  description: string

  @DtoProperty({ type: 'uuid' })
  settlementId: string
}

export class CircleChargebackDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'uuid' })
  paymentId: string

  @DtoProperty({ custom_type: [CircleChargebackSettlementDto] })
  history: CircleChargebackSettlementDto[]
}
