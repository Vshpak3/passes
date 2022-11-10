import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { UserDto } from '../../user/dto/user.dto'
import { UserEntity } from '../../user/entities/user.entity'
import { ListMemberEntity } from '../entities/list-member.entity'

export class ListMemberDto extends PickType(UserDto, [
  'userId',
  'username',
  'displayName',
] as const) {
  @DtoProperty({ type: 'uuid' })
  listMemberId: string

  @DtoProperty({ type: 'uuid', optional: true })
  follow?: string

  @DtoProperty({ type: 'date' })
  createdAt: Date

  @DtoProperty({ type: 'number', optional: true, nullable: true })
  metaNumber?: number | null

  constructor(
    listMember:
      | (ListMemberEntity &
          Pick<UserEntity, 'username' | 'display_name'> & { follow?: string })
      | undefined,
  ) {
    super()
    if (listMember) {
      this.listMemberId = listMember.id
      this.userId = listMember.user_id
      this.username = listMember.username
      this.displayName = listMember.display_name
      this.createdAt = listMember.created_at
      this.metaNumber = listMember.meta_number

      this.follow = listMember.follow
    }
  }
}
