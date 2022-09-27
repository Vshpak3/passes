import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { ChannelOrderTypeEnum } from '../enum/channel.order.enum'
import { ChannelMemberDto } from './channel-member.dto'

export class GetChannelRequestDto {
  @DtoProperty({ type: 'uuid', optional: true })
  userId: string
}

export class GetChannelResponseDto extends ChannelMemberDto {}

export class GetChannelsRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'search',
  'order',
]) {
  @DtoProperty({ type: 'date', optional: true })
  recent?: Date

  @DtoProperty({ type: 'number', optional: true })
  tip?: number

  @DtoProperty({ custom_type: ChannelOrderTypeEnum })
  orderType: ChannelOrderTypeEnum

  @DtoProperty({ type: 'boolean' })
  unreadOnly: boolean
}

export class GetChannelsResponseDto extends PageResponseDto {
  @DtoProperty({ custom_type: [ChannelMemberDto] })
  channelMembers: ChannelMemberDto[]

  @DtoProperty({ type: 'number', optional: true })
  tip?: number

  @DtoProperty({ type: 'date', optional: true })
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
