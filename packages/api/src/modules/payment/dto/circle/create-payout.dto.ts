import { ApiProperty } from '@nestjs/swagger'

import { AmountDto } from './circle-utils.dto'

export class CreatePayoutDto {
  @ApiProperty()
  idempotencyKey: string
  @ApiProperty()
  destination: DestinationDto
  @ApiProperty()
  amount: AmountDto
}

export class DestinationDto {
  @ApiProperty()
  type: string
  @ApiProperty()
  id: string
}
