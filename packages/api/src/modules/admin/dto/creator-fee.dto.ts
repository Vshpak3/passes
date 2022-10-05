// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */

import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CreatorFeeEntity } from '../../payment/entities/creator-fee.entity'
import { AdminDto } from './admin.dto'

export class CreatorFeeDto extends AdminDto {
  @DtoProperty({ type: 'uuid' })
  creatorId: string

  @Min(0)
  @DtoProperty({ type: 'currency', nullable: true })
  fiatRate: number | null

  @Min(0)
  @DtoProperty({ type: 'currency', nullable: true })
  fiatFlat: number | null

  @Min(0)
  @DtoProperty({ type: 'currency', nullable: true })
  cryptoRate: number | null

  @Min(0)
  @DtoProperty({ type: 'currency', nullable: true })
  cryptoFlat: number | null

  constructor(creatorFee: CreatorFeeEntity | undefined) {
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
