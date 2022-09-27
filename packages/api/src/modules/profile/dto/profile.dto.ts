import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_LEGAL_FULL_NAME_LENGTH,
} from '../../user/constants/schema'
import {
  EXTERNAL_USERNAME_LENGTH,
  PROFILE_COVER_DESCRIPTION_LENGTH,
  PROFILE_COVER_TITLE_LENGTH,
  PROFILE_DESCRIPTION_LENGTH,
} from '../constants/schema'

export class ProfileDto {
  @DtoProperty({ type: 'uuid' })
  profileId: string

  @DtoProperty({ type: 'uuid' })
  userId: string

  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  legalFullName?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  displayName?: string

  @Length(1, PROFILE_COVER_TITLE_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  coverTitle?: string

  @Length(1, PROFILE_COVER_DESCRIPTION_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  coverDescription?: string

  @Length(1, PROFILE_DESCRIPTION_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  description?: string

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  discordUsername?: string

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  facebookUsername?: string

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  instagramUsername?: string

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  tiktokUsername?: string

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  twitchUsername?: string

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  twitterUsername?: string

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  youtubeUsername?: string

  @DtoProperty({ type: 'boolean', optional: true })
  isKYCVerified?: boolean

  @DtoProperty({ type: 'boolean' })
  isActive: boolean

  @DtoProperty({ type: 'boolean', optional: true })
  isAdult?: boolean

  constructor(profile) {
    this.profileId = profile.id
    this.userId = profile.user_id
    this.description = profile.description
    this.legalFullName = profile.legal_full_name
    this.displayName = profile.display_name

    this.coverTitle = profile.cover_title
    this.coverDescription = profile.cover_description

    this.discordUsername = profile.discord_username
    this.facebookUsername = profile.facebook_username
    this.instagramUsername = profile.instagram_username
    this.tiktokUsername = profile.tiktok_username
    this.twitchUsername = profile.twitch_username
    this.twitterUsername = profile.twitter_username
    this.youtubeUsername = profile.youtube_username

    this.isKYCVerified = profile.is_kycverified
    this.isActive = profile.is_active
    this.isAdult = profile.is_adult
  }
}
