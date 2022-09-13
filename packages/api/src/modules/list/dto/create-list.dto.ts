import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { LIST_NAME_LENGTH } from '../constants/schema'

export class CreateListRequestDto {
  @Length(1, LIST_NAME_LENGTH)
  @DtoProperty()
  name: string

  @IsUUID('all', { each: true })
  @DtoProperty()
  userIds: string[]
}
