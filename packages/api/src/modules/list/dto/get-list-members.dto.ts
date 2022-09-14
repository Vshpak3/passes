import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ListMemberDto } from './list-member.dto'

export class GetListMembersRequestDto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @DtoProperty({ optional: true })
  cursor?: string
}

export class GetListMembersResponseDto {
  @DtoProperty({ type: [ListMemberDto] })
  listMembers: ListMemberDto[]

  constructor(listMembers: ListMemberDto[]) {
    this.listMembers = listMembers
  }
}
