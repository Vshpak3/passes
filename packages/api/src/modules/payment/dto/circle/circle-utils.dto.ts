import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class AmountDto {
  @ApiProperty()
  amount: string

  @ApiProperty()
  currency: string
}

export class SourceDto {
  @ApiProperty()
  type: string

  //for crypto payments
  @ApiPropertyOptional()
  address?: string

  @ApiPropertyOptional()
  chain?: string

  //for all other payments
  @ApiPropertyOptional()
  id?: string
}
