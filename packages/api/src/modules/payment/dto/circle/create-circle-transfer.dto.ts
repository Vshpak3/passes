import { DtoProperty } from '../../../../web/dto.web'
import {
  CircleAmountDto,
  CircleDestinationDto,
  CircleSourceDto,
} from './circle-utils.dto'

export class CircleCreateTransferRequestDto {
  @DtoProperty()
  idempotencyKey: string

  @DtoProperty()
  source: CircleSourceDto

  @DtoProperty()
  destination: CircleDestinationDto

  @DtoProperty()
  amount: CircleAmountDto
}
