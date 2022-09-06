import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ListMemberDto } from './list-member.dto'

export class GetListMembersRequestto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @DtoProperty({ required: false })
  cursor?: string
}

export class GetListMembersResponseDto {
  @DtoProperty({ type: [ListMemberDto] })
  listMembers: ListMemberDto[]
}
