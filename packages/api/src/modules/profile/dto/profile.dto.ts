// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
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
import { ProfileEntity } from '../entities/profile.entity'

export class ProfileDto {
  @DtoProperty({ type: 'uuid' })
  profileId: string

  @DtoProperty({ type: 'uuid' })
  userId: string

  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  legalFullName?: string | null

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  displayName?: string | null

  @Length(0, PROFILE_COVER_TITLE_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  coverTitle?: string | null

  @Length(0, PROFILE_COVER_DESCRIPTION_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  coverDescription?: string | null

  @Length(0, PROFILE_DESCRIPTION_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  description?: string | null

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  discordUsername?: string | null

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  facebookUsername?: string | null

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  instagramUsername?: string | null

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  tiktokUsername?: string | null

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  twitchUsername?: string | null

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  twitterUsername?: string | null

  @Length(1, EXTERNAL_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', nullable: true, optional: true })
  youtubeUsername?: string | null

  @DtoProperty({ type: 'boolean' })
  isKYCVerified: boolean

  @DtoProperty({ type: 'boolean' })
  isActive: boolean

  @DtoProperty({ type: 'boolean' })
  isAdult: boolean

  constructor(
    profile: ProfileEntity & {
      legal_full_name?: string
      display_name?: string
      is_kyc_verified: boolean
      is_adult: boolean
    },
  ) {
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

    this.isKYCVerified = profile.is_kyc_verified
    this.isActive = profile.is_active
    this.isAdult = profile.is_adult
  }
}
