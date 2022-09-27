import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class CreatorFeeDto {
  @DtoProperty({ type: 'uuid' })
  creatorId: string

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  fiatRate?: number

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  fiatFlat?: number

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  cryptoRate?: number

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  cryptoFlat?: number

  constructor(creatorFee) {
    if (creatorFee) {
      this.creatorId = creatorFee.creator_id
      this.fiatRate = creatorFee.fiat_rate
      this.fiatFlat = creatorFee.fiat_flat
      this.cryptoRate = creatorFee.crypto_rate
      this.cryptoFlat = creatorFee.crypto_flat
    }
  }
}
