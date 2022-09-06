import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class ListMemberDto {
  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  username: string

  @DtoProperty()
  displayName: string

  constructor(listMember) {
    this.userId = listMember.user_id
    this.username = listMember.username
    this.displayName = listMember.display_name
  }
}
