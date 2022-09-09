import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'
import { CreatorFeeDto } from './creator-fee.dto'

export class GetCreatorFeeResponseDto extends CreatorFeeDto {}

export class GetCreatorFeeRequestDto extends AdminDto {
  @IsUUID()
  @DtoProperty()
  creatorId: string
}
