import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'
import { CreatorFeeDto } from './creator-fee.dto'

export class GetCreatorFeeResponseDto extends CreatorFeeDto {}

export class GetCreatorFeeRequestDto extends AdminDto {
  @DtoProperty({ type: 'uuid' })
  creatorId: string
}
