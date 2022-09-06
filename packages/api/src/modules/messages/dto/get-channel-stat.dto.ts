import { DtoProperty } from '../../../web/dto.web'
import { ChannelStatDto } from './channel-stat.dto'

export class GetChannelStatsRequestDto {
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
