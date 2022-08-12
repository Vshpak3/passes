import { ApiProperty } from '@nestjs/swagger'

import {
  CircleAmountDto,
  CircleDestinationDto,
  CircleSourceDto,
} from './circle-utils.dto'
import { CircleMetaDataDto } from './metadata.dto'

export class CircleCreatePayoutDto {
  @ApiProperty()
  idempotencyKey: string

  @ApiProperty()
  source: CircleSourceDto

  @ApiProperty()
  destination: CircleDestinationDto

  @ApiProperty()
  amount: CircleAmountDto

  @ApiProperty()
  metadata: CircleMetaDataDto
}
