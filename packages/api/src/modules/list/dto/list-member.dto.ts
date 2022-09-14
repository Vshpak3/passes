import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'

export class ListMemberDto {
  @IsUUID()
  @DtoProperty()
  listMemberId: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty()
  username: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty()
  displayName: string

  @DtoProperty({ optional: true })
  isFollowing?: boolean

  @DtoProperty()
  createdAt: Date

  constructor(listMember) {
    if (listMember) {
      this.listMemberId = listMember.id
      this.userId = listMember.user_id
      this.username = listMember.username
      this.displayName = listMember.display_name
      this.createdAt = listMember.created_at

      this.isFollowing = !!listMember.follow
    }
  }
}
