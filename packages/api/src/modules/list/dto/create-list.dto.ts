import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { LIST_NAME_LENGTH } from '../constants/schema'

export class CreateListRequestDto {
  @Length(1, LIST_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  name: string

  @DtoProperty({ type: 'uuid[]' })
  userIds: string[]
}

export class CreateListResponseDto {
  @DtoProperty({ type: 'uuid' })
  listId: string

  constructor(listId: string) {
    this.listId = listId
  }
}
