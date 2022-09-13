import { IsUUID, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class CreatorFeeDto {
  @IsUUID()
  @DtoProperty()
  creatorId: string

  @Min(0)
  @DtoProperty({ required: false })
  fiatRate?: number

  @Min(0)
  @DtoProperty({ required: false })
  fiatFlat?: number

  @Min(0)
  @DtoProperty({ required: false })
  cryptoRate?: number

  @Min(0)
  @DtoProperty({ required: false })
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
