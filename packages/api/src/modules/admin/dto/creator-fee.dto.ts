import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'

export class CreatorFeeDto extends AdminDto {
  @DtoProperty({ type: 'uuid' })
  creatorId: string

  @Min(0)
  @DtoProperty({ type: 'number' })
  fiatRate: number

  @Min(0)
  @DtoProperty({ type: 'number' })
  fiatFlat: number

  @Min(0)
  @DtoProperty({ type: 'number' })
  cryptoRate: number

  @Min(0)
  @DtoProperty({ type: 'number' })
  cryptoFlat: number

  constructor(creatorFee) {
    super()
    if (creatorFee) {
      this.creatorId = creatorFee.creator_id
      this.fiatRate = creatorFee.fiat_rate
      this.fiatFlat = creatorFee.fiat_flat
      this.cryptoRate = creatorFee.crypto_rate
      this.cryptoFlat = creatorFee.crypto_flat
    }
  }
}
