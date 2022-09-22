import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'

export class UpdateChargebackRequestDto extends AdminDto {
  @IsUUID()
  @DtoProperty()
  circleChargebackId: string

  @DtoProperty()
  disputed: boolean
}
