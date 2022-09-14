import { PickType } from '@nestjs/swagger'

import { ProfileDto } from './profile.dto'

export class CreateOrUpdateProfileRequestDto extends PickType(ProfileDto, [
  'coverTitle',
  'coverDescription',
  'description',
  'instagramUrl',
  'tiktokUrl',
  'youtubeUrl',
  'discordUrl',
  'facebookUrl',
  'twitchUrl',
]) {}
