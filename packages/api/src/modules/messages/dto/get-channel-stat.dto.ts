import { ApiProperty } from '@nestjs/swagger'

import { ChannelStatDto } from './channel-stat.dto'

export class GetChannelStatsRequestDto {
  @ApiProperty()
  channelIds: string[]
}

export class GetChannelStatResponseDto extends ChannelStatDto {}

export class GetChannelStatsResponseDto {
  @ApiProperty({ type: [ChannelStatDto] })
  channelStats: ChannelStatDto[]

  constructor(channelStats: ChannelStatDto[]) {
    this.channelStats = channelStats
  }
}
