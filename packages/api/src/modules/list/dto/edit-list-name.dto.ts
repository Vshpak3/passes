import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { LIST_NAME_LENGTH } from '../constants/schema'

export class EditListNameRequestDto {
  @DtoProperty({ type: 'uuid' })
  listId: string

  @Length(1, LIST_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  name: string
}
