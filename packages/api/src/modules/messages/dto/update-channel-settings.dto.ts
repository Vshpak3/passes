import { PickType } from '@nestjs/swagger'

import { ChannelMemberDto } from './channel-member.dto'

export class UpdateChannelSettingsRequestDto extends PickType(
  ChannelMemberDto,
  ['unlimitedMessages', 'channelId'],
) {}
