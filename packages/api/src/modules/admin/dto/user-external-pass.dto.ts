import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'

export class UserExternalPassRequestDto extends AdminDto {
  @IsUUID()
  @DtoProperty()
  userId: string

  @IsUUID()
  @DtoProperty()
  passId: string
}
