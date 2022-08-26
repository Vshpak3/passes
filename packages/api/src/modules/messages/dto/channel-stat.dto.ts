import { ApiProperty } from '@nestjs/swagger'

export class ChannelStatDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  totalTipAmount: number

  constructor(channelStat) {
    if (channelStat) {
      this.id = channelStat.channel_id
      this.totalTipAmount = channelStat.total_tip_amount
    }
  }
}
