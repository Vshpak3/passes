import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'

export class ListMemberDto {
  @DtoProperty({ type: 'uuid' })
  listMemberId: string

  @DtoProperty({ type: 'uuid' })
  userId: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string' })
  username: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  displayName: string

  @DtoProperty({ type: 'uuid', optional: true })
  follow?: string

  @DtoProperty({ type: 'date' })
  createdAt: Date

  constructor(listMember) {
    if (listMember) {
      this.listMemberId = listMember.id
      this.userId = listMember.user_id
      this.username = listMember.username
      this.displayName = listMember.display_name
      this.createdAt = listMember.created_at

      this.follow = listMember.follow
    }
  }
}
