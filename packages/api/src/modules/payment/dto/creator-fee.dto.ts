import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CreatorFeeDto {
  @IsUUID()
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
