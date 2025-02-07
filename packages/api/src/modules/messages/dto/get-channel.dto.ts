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
  'spent',
]) {
  @DtoProperty({ type: 'date', optional: true })
  recent?: Date

  @DtoProperty({ type: 'currency', optional: true })
  tip?: number

  @DtoProperty({ custom_type: ChannelOrderTypeEnum })
  orderType: ChannelOrderTypeEnum

  @DtoProperty({ type: 'boolean' })
  unreadOnly: boolean
}

export class GetChannelsResponseDto
  extends GetChannelsRequestDto
  implements PageResponseDto<ChannelMemberDto>
{
  @DtoProperty({ custom_type: [ChannelMemberDto] })
  data: ChannelMemberDto[]

  constructor(
    channelMembers: ChannelMemberDto[],
    requestDto: GetChannelsRequestDto,
  ) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.lastId = undefined
    this.data = channelMembers
    if (channelMembers.length > 0) {
      this.lastId = channelMembers[channelMembers.length - 1].channelMemberId
      switch (requestDto.orderType) {
        case ChannelOrderTypeEnum.RECENT:
          this.recent =
            channelMembers[channelMembers.length - 1].recent ?? undefined
          break
        case ChannelOrderTypeEnum.TIP:
          this.tip = channelMembers[channelMembers.length - 1].unreadTip
          break
        case ChannelOrderTypeEnum.SPENT:
          this.spent = channelMembers[channelMembers.length - 1].spent
          break
      }
    }
  }
}
