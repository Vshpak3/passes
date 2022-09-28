import { DtoProperty } from '../../../web/dto.web'
import { ChannelEntity } from '../entities/channel.entity'

export class ChannelDto {
  @DtoProperty({ type: 'uuid', optional: true })
  channelId: string

  @DtoProperty({ type: 'date' })
  recent: Date

  constructor(channel: ChannelEntity) {
    if (channel) {
      this.channelId = channel.id
      this.recent = channel.recent
    }
  }
}
