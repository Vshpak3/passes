import { DtoProperty } from '../../../../web/dto.web'
import { CircleAccountStatusEnum } from '../../enum/circle-account.status.enum'
import {
  CircleAmountDto,
  CircleDestinationDto,
  CircleSourceDto,
} from './circle-utils.dto'

export class CircleTransferDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ custom_type: CircleAccountStatusEnum })
  status: CircleAccountStatusEnum

  @DtoProperty({ custom_type: CircleSourceDto })
  source: CircleSourceDto

  @DtoProperty({ custom_type: CircleDestinationDto })
  destination: CircleDestinationDto

  @DtoProperty({ custom_type: CircleAmountDto })
  amount: CircleAmountDto

  @DtoProperty({ type: 'string' })
  transactionHash: string
}
