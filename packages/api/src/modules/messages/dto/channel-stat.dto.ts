import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ChannelStatDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  channelId: string

  @ApiProperty()
  totalTipAmount: number

  constructor(channelStat) {
    if (channelStat) {
      this.id = channelStat.id
      this.channelId = channelStat.channel_id
      this.totalTipAmount = channelStat.total_tip_amount
    }
  }
}
