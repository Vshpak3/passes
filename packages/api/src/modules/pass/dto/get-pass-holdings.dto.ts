import { PickType } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { ListMemberOrderTypeEnum } from '../../list/enum/list-member.order.enum'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { PassHolderDto } from './pass-holder.dto'

export class GetPassHoldingsRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
  'order',
  'search',
]) {
  @DtoProperty({ type: 'uuid', optional: true })
  creatorId?: string

  @DtoProperty({ type: 'uuid', optional: true })
  passId?: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  username?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  displayName?: string

  @DtoProperty({ custom_type: ListMemberOrderTypeEnum })
  orderType: ListMemberOrderTypeEnum
}

export class GetPassHoldingResponseDto extends PassHolderDto {}

export class GetPassHoldingsResponseDto extends PageResponseDto {
  @DtoProperty({ custom_type: [PassHolderDto] })
  passHolders: PassHolderDto[]

  @DtoProperty({ custom_type: ListMemberOrderTypeEnum })
  orderType: ListMemberOrderTypeEnum

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  username?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  displayName?: string

  constructor(
    passHolders: PassHolderDto[],
    orderType: ListMemberOrderTypeEnum,
  ) {
    super()
    this.passHolders = passHolders
    if (passHolders.length > 0) {
      this.lastId = passHolders[passHolders.length - 1].passHolderId
      switch (orderType) {
        case ListMemberOrderTypeEnum.CREATED_AT:
          this.createdAt = passHolders[passHolders.length - 1].createdAt
          break
        case ListMemberOrderTypeEnum.USERNAME:
          this.username = passHolders[passHolders.length - 1].creatorUsername
          break
        case ListMemberOrderTypeEnum.DISPLAY_NAME:
          this.displayName =
            passHolders[passHolders.length - 1].creatorDisplayName
          break
      }
    }
  }
}
