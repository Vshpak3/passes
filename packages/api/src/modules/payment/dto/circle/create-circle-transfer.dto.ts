import { ApiProperty } from '@nestjs/swagger'

import {
  CircleAmountDto,
  CircleDestinationDto,
  CircleSourceDto,
} from './circle-utils.dto'

export class CircleCreateTransferRequestDto {
  @ApiProperty()
  idempotencyKey: string

  @ApiProperty()
  source: CircleSourceDto

  @ApiProperty()
  destination: CircleDestinationDto

  @ApiProperty()
  amount: CircleAmountDto
}
