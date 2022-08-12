import { ApiProperty } from '@nestjs/swagger'

import { CircleTransferStatusEnum } from '../../enum/circle-transfer.status.enum'
import {
  CircleAmountDto,
  CircleDestinationDto,
  CircleSourceDto,
} from './circle-utils.dto'

export class CircleTransferDto {
  @ApiProperty()
  id: string

  @ApiProperty({ enum: CircleTransferStatusEnum })
  status: CircleTransferStatusEnum

  @ApiProperty()
  source: CircleSourceDto

  @ApiProperty()
  destination: CircleDestinationDto

  @ApiProperty()
  amount: CircleAmountDto

  @ApiProperty()
  transactionHash: string
}
