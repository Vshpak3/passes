import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CHANNEL_ID_LENGTH } from '../constants/schema'

export class ChannelSettingsDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @Length(1, CHANNEL_ID_LENGTH)
  @DtoProperty()
  channelId: string

  @IsUUID()
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
