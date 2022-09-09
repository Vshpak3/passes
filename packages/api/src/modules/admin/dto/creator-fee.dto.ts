import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'

export class CreatorFeeDto extends AdminDto {
  @IsUUID()
  @DtoProperty()
  creatorId: string

  @DtoProperty()
  fiatRate: number

  @DtoProperty()
  fiatFlat: number

  @DtoProperty()
  cryptoRate: number

  @DtoProperty()
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
