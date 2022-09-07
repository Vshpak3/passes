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

  @DtoProperty()
  isFollowing: boolean

  constructor(listMember) {
    this.userId = listMember.user_id
    this.username = listMember.username
    this.displayName = listMember.display_name

    this.isFollowing = !!listMember.follow
  }
}
