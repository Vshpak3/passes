import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class RemoveListMembersRequestDto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @IsUUID('all', { each: true })
  @DtoProperty()
  userIds: string[]
}
