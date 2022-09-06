import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class RemoveListMembersRequestDto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @DtoProperty()
  userIds: string[]
}
