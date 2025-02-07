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
  tipReceived: number

  @DtoProperty({ type: 'date', nullable: true })
  readAt: Date | null

  @Min(0)
  @DtoProperty({ type: 'currency' })
  unreadTip: number

  @Min(0)
  @DtoProperty({ type: 'boolean' })
  unread: boolean

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string' })
  otherUserUsername: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  otherUserDisplayName: string

  @DtoProperty({ type: 'boolean' })
  otherUserIsCreator: boolean

  @DtoProperty({ type: 'number', optional: true, nullable: true })
  spent?: number | null

  constructor(
    channelMember: ChannelMemberEntity &
      ChannelEntity & {
        other_user_username: string
        other_user_display_name: string
        other_user_is_creator: boolean
        spent?: number | null
      },
  ) {
    super(channelMember)
    if (channelMember) {
      this.channelMemberId = channelMember.id
      this.userId = channelMember.user_id
      this.unlimitedMessages = channelMember.unlimited_messages
      this.tipSent = channelMember.tip_sent
      this.tipReceived = channelMember.tip_received
      this.unreadTip = channelMember.unread_tip
      this.otherUserId = channelMember.other_user_id
      this.readAt = channelMember.read_at
      this.unread = channelMember.unread

      this.channelId = channelMember.channel_id

      this.otherUserUsername = channelMember.other_user_username
      this.otherUserDisplayName = channelMember.other_user_display_name
      this.otherUserIsCreator = channelMember.other_user_is_creator

      this.spent = channelMember.spent
    }
  }
}
