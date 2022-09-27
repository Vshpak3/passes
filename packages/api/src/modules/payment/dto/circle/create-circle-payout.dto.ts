import { DtoProperty } from '../../../../web/dto.web'
import {
  CircleAmountDto,
  CircleDestinationDto,
  CircleSourceDto,
} from './circle-utils.dto'
import { CircleMetaDataDto } from './metadata.dto'

export class CircleCreatePayoutRequestDto {
  @DtoProperty({ type: 'string' })
  idempotencyKey: string

  @DtoProperty({ custom_type: CircleSourceDto })
  source: CircleSourceDto

  @DtoProperty({ custom_type: CircleDestinationDto })
  destination: CircleDestinationDto

  @DtoProperty({ custom_type: CircleAmountDto })
  amount: CircleAmountDto

  @DtoProperty({ custom_type: CircleMetaDataDto })
  metadata: CircleMetaDataDto
}
