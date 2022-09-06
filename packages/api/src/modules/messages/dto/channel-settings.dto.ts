import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class ChannelSettingsDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  channelId: string

  @DtoProperty()
  userId: string

  @DtoProperty()
  unlimitedMessages: boolean

  constructor(channelSettings) {
    if (channelSettings) {
      this.id = channelSettings.id
      this.channelId = channelSettings.channel_id
      this.userId = channelSettings.user_id
      this.unlimitedMessages = channelSettings.unlimited_messages
    }
  }
}
