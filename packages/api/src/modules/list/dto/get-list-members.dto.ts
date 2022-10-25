import { PickType } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { ListMemberOrderTypeEnum } from '../enum/list-member.order.enum'
import { ListMemberDto } from './list-member.dto'

export class GetListMembersRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
  'order',
  'search',
]) {
  @DtoProperty({ type: 'uuid' })
  listId: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  username?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true, nullable: true })
  displayName?: string | null

  @DtoProperty({ type: 'number', optional: true })
  metadataNumber?: number

  @DtoProperty({ custom_type: ListMemberOrderTypeEnum })
  orderType: ListMemberOrderTypeEnum
}

export class GetListMembersResponseDto
  extends GetListMembersRequestDto
  implements PageResponseDto<ListMemberDto>
{
  @DtoProperty({ custom_type: [ListMemberDto] })
  data: ListMemberDto[]

  constructor(
    listMembers: ListMemberDto[],
    requestDto: Partial<GetListMembersRequestDto>,
  ) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.lastId = undefined
    this.data = listMembers

    if (listMembers.length > 0) {
      this.lastId = listMembers[listMembers.length - 1].listMemberId
      if (!this.lastId) {
        this.lastId = listMembers[listMembers.length - 1].follow as string
      }
      switch (requestDto.orderType) {
        case ListMemberOrderTypeEnum.CREATED_AT:
          this.createdAt = listMembers[listMembers.length - 1].createdAt
          break
        case ListMemberOrderTypeEnum.USERNAME:
          this.username = listMembers[listMembers.length - 1].username
          break
        case ListMemberOrderTypeEnum.DISPLAY_NAME:
          this.displayName = listMembers[listMembers.length - 1].displayName
          break
      }
    }
  }
}
