import { DtoProperty } from '../../../web/dto.web'

export class AddListMembersRequestDto {
  @DtoProperty({ type: 'uuid' })
  listId: string

  @DtoProperty({ type: 'uuid[]' })
  userIds: string[]
}
