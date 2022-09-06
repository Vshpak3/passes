import { DtoProperty } from '../../../../web/endpoint.web'
import {
  CircleAmountDto,
  CircleDestinationDto,
  CircleSourceDto,
} from './circle-utils.dto'
import { CircleMetaDataDto } from './metadata.dto'

export class CircleCreatePayoutRequestDto {
  @DtoProperty()
  idempotencyKey: string

  @DtoProperty()
  source: CircleSourceDto

  @DtoProperty()
  destination: CircleDestinationDto

  @DtoProperty()
  amount: CircleAmountDto

  @DtoProperty()
  metadata: CircleMetaDataDto
}
