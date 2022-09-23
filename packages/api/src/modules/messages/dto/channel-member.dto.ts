import { IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { STREAM_CHANNEL_ID_LENGTH } from '../constants/schema'
import { ChannelDto } from './channel-dto'
import { MessageDto } from './message.dto'

export class ChannelMemberDto extends ChannelDto {
  @IsUUID()
  @DtoProperty()
  channelMemberId: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @IsUUID()
  @DtoProperty()
  otherUserId: string

  @Length(1, STREAM_CHANNEL_ID_LENGTH)
  @DtoProperty()
  channelId: string

  @DtoProperty()
  unlimitedMessages: boolean

  @Min(0)
  @DtoProperty()
  tipSent: number

  @Min(0)
  @DtoProperty()
  tipRecieved: number

  @Min(0)
  @DtoProperty()
  unreadTip: number

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ optional: true })
  otherUserUsername?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ optional: true })
  otherUserDisplayName?: string

  @DtoProperty({ optional: true })
  mostRecentMessage?: MessageDto

  constructor(channelMember, mostRecentMessage?) {
    super(channelMember)
    if (channelMember) {
      this.channelMemberId = channelMember.id
      this.userId = channelMember.user_id
      this.unlimitedMessages = channelMember.unlimited_messages
      this.tipSent = channelMember.tip_sent
      this.tipRecieved = channelMember.tip_received
      this.unreadTip = channelMember.unread_tip

      this.channelId = channelMember.channel_id

      this.otherUserUsername = channelMember.other_user_username
      this.otherUserDisplayName = channelMember.other_user_display_name
    }
    this.mostRecentMessage = mostRecentMessage
  }
}
