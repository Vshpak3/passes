import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class ChannelStatDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  channelId: string

  @DtoProperty()
  totalTipAmount: number

  constructor(channelStat) {
    if (channelStat) {
      this.id = channelStat.id
      this.channelId = channelStat.channel_id
      this.totalTipAmount = channelStat.total_tip_amount
    }
  }
}
