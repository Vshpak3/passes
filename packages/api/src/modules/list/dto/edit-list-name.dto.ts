import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class EditListNameRequestDto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @DtoProperty()
  name: string
}
