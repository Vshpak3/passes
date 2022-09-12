import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class ChannelStatDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  channelId: string

  @DtoProperty()
  tipSent: number

  @DtoProperty()
  tipRecieved: number

  @DtoProperty()
  unreadTip: number

  constructor(channelStat) {
    if (channelStat) {
      this.id = channelStat.id
      this.channelId = channelStat.channel_id
      this.tipSent = channelStat.tip_sent
      this.tipRecieved = channelStat.tip_received
      this.unreadTip = channelStat.unread_tip
    }
  }
}
