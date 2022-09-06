import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class AddListMembersRequestDto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @DtoProperty()
  userIds: string[]
}
