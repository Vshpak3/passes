import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CreateExternalPassRequestDto } from './create-external-pass.dto'

export class UpdateExternalPassRequestDto extends CreateExternalPassRequestDto {
  @IsUUID()
  @DtoProperty()
  passId: string
}
