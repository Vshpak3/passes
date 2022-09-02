import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ChannelSettingsDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  channelId: string

  @ApiProperty()
  userId: string

  @ApiProperty()
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
