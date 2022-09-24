import { PickType } from '@nestjs/swagger'
import { IsEnum, IsUUID } from 'class-validator'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { ChannelOrderTypeEnum } from '../enum/channel.order.enum'
import { ChannelMemberDto } from './channel-member.dto'

export class GetChannelRequestDto {
  @IsUUID()
  @DtoProperty({ optional: true })
  userId: string
}

export class GetChannelResponseDto extends ChannelMemberDto {}

export class GetChannelsRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'search',
  'order',
]) {
  @DtoProperty({ optional: true })
  recent?: Date

  @DtoProperty({ optional: true })
  tip?: number

  @IsEnum(ChannelOrderTypeEnum)
  @DtoProperty({ enum: ChannelOrderTypeEnum })
  orderType: ChannelOrderTypeEnum

  @DtoProperty()
  unreadOnly: boolean
}

export class GetChannelsResponseDto extends PageResponseDto {
  @DtoProperty({ type: [ChannelMemberDto] })
  channelMembers: ChannelMemberDto[]

  @DtoProperty({ optional: true })
  tip?: number

  @DtoProperty({ optional: true })
  recent?: Date

  constructor(
    channelMembers: ChannelMemberDto[],
    orderType: ChannelOrderTypeEnum,
  ) {
    super()
    this.channelMembers = channelMembers

    if (channelMembers.length > 0) {
      this.lastId = channelMembers[channelMembers.length - 1].channelMemberId
      switch (orderType) {
        case ChannelOrderTypeEnum.RECENT:
          this.recent = channelMembers[channelMembers.length - 1].recent
          break
        case ChannelOrderTypeEnum.TIP:
          this.tip = channelMembers[channelMembers.length - 1].unreadTip
          break
      }
    }
  }
}
