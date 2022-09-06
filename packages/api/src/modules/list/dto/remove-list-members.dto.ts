import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class RemoveListMembersRequestDto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @DtoProperty()
  userIds: string[]
}
