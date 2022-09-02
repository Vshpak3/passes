import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ChannelStatDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  totalTipAmount: number

  @ApiProperty()
  blocked: boolean

  constructor(channelStat) {
    if (channelStat) {
      this.id = channelStat.channel_id
      this.totalTipAmount = channelStat.total_tip_amount
      this.blocked = channelStat.blocked
    }
  }
}
