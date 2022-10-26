import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CreatorFeeEntity } from '../entities/creator-fee.entity'

export class CreatorFeeDto {
  @DtoProperty({ type: 'uuid' })
  creatorId: string

  @Min(0)
  @DtoProperty({ type: 'currency', nullable: true, optional: true })
  fiatRate?: number | null

  @Min(0)
  @DtoProperty({ type: 'currency', nullable: true, optional: true })
  fiatFlat?: number | null

  @Min(0)
  @DtoProperty({ type: 'currency', nullable: true, optional: true })
  cryptoRate?: number | null

  @Min(0)
  @DtoProperty({ type: 'currency', nullable: true, optional: true })
  cryptoFlat?: number | null

  constructor(creatorFee: CreatorFeeEntity | undefined) {
    if (creatorFee) {
      this.creatorId = creatorFee.creator_id
      this.fiatRate = creatorFee.fiat_rate
      this.fiatFlat = creatorFee.fiat_flat
      this.cryptoRate = creatorFee.crypto_rate
      this.cryptoFlat = creatorFee.crypto_flat
    }
  }
}
