import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class EditListNameRequestDto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @DtoProperty()
  name: string
}
