import { DtoProperty } from '../../../web/dto.web'
import { ChargebackDto } from './chargeback.dto'

export class GetChargebacksResponseDto {
  @DtoProperty({ custom_type: [ChargebackDto] })
  data: ChargebackDto[]

  constructor(chargebacks: ChargebackDto[]) {
    this.data = chargebacks
  }
}
