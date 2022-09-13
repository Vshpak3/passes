import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { LIST_NAME_LENGTH } from '../constants/schema'

export class EditListNameRequestDto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @Length(1, LIST_NAME_LENGTH)
  @DtoProperty()
  name: string
}
