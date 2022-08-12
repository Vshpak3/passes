import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CircleAmountDto {
  @ApiProperty()
  amount: string

  @ApiProperty()
  currency: string
}

export class CircleSourceDto {
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

  @ApiPropertyOptional()
  identities?: any
}

export type CircleDestinationDto = CircleSourceDto
