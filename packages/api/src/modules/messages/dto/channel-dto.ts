import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { STREAM_CHANNEL_ID_LENGTH } from '../constants/schema'

export class ChannelDto {
  @IsUUID()
  @DtoProperty({ optional: true })
  channelId: string

  @Length(1, STREAM_CHANNEL_ID_LENGTH)
  @DtoProperty()
  streamChannelId: string

  @DtoProperty()
  recent: Date

  constructor(channel) {
    if (channel) {
      this.channelId = channel.id
      this.streamChannelId = channel.stream_channel_id
      this.recent = channel.recent
    }
  }
}
