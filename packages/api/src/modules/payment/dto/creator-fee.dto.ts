import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreatorFeeDto {
  @ApiProperty()
  creatorId: string

  @ApiPropertyOptional()
  fiatRate?: number

  @ApiPropertyOptional()
  fiatFlat?: number

  @ApiPropertyOptional()
  cryptoRate?: number

  @ApiPropertyOptional()
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
