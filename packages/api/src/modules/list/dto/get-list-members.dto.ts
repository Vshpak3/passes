import { PickType } from '@nestjs/swagger'
import { IsEnum, IsUUID, Length } from 'class-validator'

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
  @IsUUID()
  @DtoProperty()
  listId: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ optional: true })
  username?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ optional: true })
  displayName?: string

  @IsEnum(ListMemberOrderTypeEnum)
  @DtoProperty({ enum: ListMemberOrderTypeEnum })
  orderType: ListMemberOrderTypeEnum
}

export class GetListMembersResponseDto extends PageResponseDto {
  @DtoProperty({ type: [ListMemberDto] })
  listMembers: ListMemberDto[]

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ optional: true })
  username?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ optional: true })
  displayName?: string

  constructor(
    listMembers: ListMemberDto[],
    orderType: ListMemberOrderTypeEnum,
  ) {
    super()
    this.listMembers = listMembers

    if (listMembers.length > 0) {
      this.lastId = listMembers[listMembers.length - 1].listMemberId
      switch (orderType) {
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
