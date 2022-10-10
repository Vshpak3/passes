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

export class GetPassHoldersRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
  'order',
  'search',
]) {
  @DtoProperty({ type: 'uuid', optional: true })
  holderId?: string

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

  @DtoProperty({ type: 'boolean' })
  activeOnly: boolean
}

export class GetPassHolderResponseDto extends PassHolderDto {}

export class GetPassHoldersResponseDto
  extends GetPassHoldersRequestDto
  implements PageResponseDto<PassHolderDto>
{
  @DtoProperty({ custom_type: [PassHolderDto] })
  data: PassHolderDto[]

  constructor(
    passHolders: PassHolderDto[],
    requestDto: GetPassHoldersRequestDto,
  ) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.data = passHolders
    if (passHolders.length > 0) {
      this.lastId = passHolders[passHolders.length - 1].passHolderId
      switch (requestDto.orderType) {
        case ListMemberOrderTypeEnum.CREATED_AT:
          this.createdAt = passHolders[passHolders.length - 1].createdAt
          break
        case ListMemberOrderTypeEnum.USERNAME:
          this.username = passHolders[passHolders.length - 1].holderUsername
          break
        case ListMemberOrderTypeEnum.DISPLAY_NAME:
          this.displayName =
            passHolders[passHolders.length - 1].holderDisplayName
          break
      }
    }
  }
}
