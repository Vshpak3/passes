import { DtoProperty } from '../../../web/dto.web'

export class RemoveListMembersRequestDto {
  @DtoProperty({ type: 'uuid' })
  listId: string

  @DtoProperty({ type: 'uuid[]' })
  userIds: string[]
}
