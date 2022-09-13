import { IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CHANNEL_ID_LENGTH } from '../constants/schema'

export class ChannelStatDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @Length(1, CHANNEL_ID_LENGTH)
  @DtoProperty()
  channelId: string

  @Min(0)
  @DtoProperty()
  tipSent: number

  @Min(0)
  @DtoProperty()
  tipRecieved: number

  @Min(0)
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
