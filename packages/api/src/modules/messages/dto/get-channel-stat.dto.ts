import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CHANNEL_ID_LENGTH } from '../constants/schema'
import { ChannelStatDto } from './channel-stat.dto'

export class GetChannelStatsRequestDto {
  @Length(1, CHANNEL_ID_LENGTH, { each: true })
  @DtoProperty()
  channelIds: string[]
}

export class GetChannelStatResponseDto extends ChannelStatDto {}

export class GetChannelStatsResponseDto {
  @DtoProperty({ type: [ChannelStatDto] })
  channelStats: ChannelStatDto[]

  constructor(channelStats: ChannelStatDto[]) {
    this.channelStats = channelStats
  }
}
