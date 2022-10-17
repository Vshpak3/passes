import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { ChannelEntity } from '../entities/channel.entity'
import { ChannelMemberEntity } from '../entities/channel-members.entity'
import { ChannelDto } from './channel-dto'

export class ChannelMemberDto extends ChannelDto {
  @DtoProperty({ type: 'uuid' })
  channelMemberId: string

  @DtoProperty({ type: 'uuid' })
  userId: string

  @DtoProperty({ type: 'uuid' })
  otherUserId: string

  @DtoProperty({ type: 'uuid' })
  channelId: string

  @DtoProperty({ type: 'boolean' })
  unlimitedMessages: boolean

  @Min(0)
  @DtoProperty({ type: 'currency' })
  tipSent: number

  @Min(0)
  @DtoProperty({ type: 'currency' })
  tipRecieved: number

  @Min(0)
  @DtoProperty({ type: 'currency' })
  unreadTip: number

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string' })
  otherUserUsername: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  otherUserDisplayName?: string

  constructor(
    channelMember: ChannelMemberEntity &
      ChannelEntity & {
        other_user_username: string
        other_user_display_name: string
      },
  ) {
    super(channelMember)
    if (channelMember) {
      this.channelMemberId = channelMember.id
      this.userId = channelMember.user_id
      this.unlimitedMessages = channelMember.unlimited_messages
      this.tipSent = channelMember.tip_sent
      this.tipRecieved = channelMember.tip_received
      this.unreadTip = channelMember.unread_tip
      this.otherUserId = channelMember.other_user_id

      this.channelId = channelMember.channel_id

      this.otherUserUsername = channelMember.other_user_username
      this.otherUserDisplayName = channelMember.other_user_display_name
    }
  }
}
