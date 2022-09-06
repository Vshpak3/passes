import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/endpoint.web'
import { CircleTransferStatusEnum } from '../../enum/circle-transfer.status.enum'
import {
  CircleAmountDto,
  CircleDestinationDto,
  CircleSourceDto,
} from './circle-utils.dto'

export class CircleTransferDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty({ enum: CircleTransferStatusEnum })
  status: CircleTransferStatusEnum

  @DtoProperty()
  source: CircleSourceDto

  @DtoProperty()
  destination: CircleDestinationDto

  @DtoProperty()
  amount: CircleAmountDto

  @DtoProperty()
  transactionHash: string
}
