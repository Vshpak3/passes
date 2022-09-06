import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class CreatorFeeDto {
  @IsUUID()
  @DtoProperty()
  creatorId: string

  @DtoProperty({ required: false })
  fiatRate?: number

  @DtoProperty({ required: false })
  fiatFlat?: number

  @DtoProperty({ required: false })
  cryptoRate?: number

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
