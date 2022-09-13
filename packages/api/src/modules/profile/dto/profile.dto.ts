import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_LEGAL_FULL_NAME_LENGTH,
} from '../../user/constants/schema'
import {
  EXTERNAL_URL_LENGTH,
  PROFILE_COVER_DESCRIPTION_LENGTH,
  PROFILE_COVER_TITLE_LENGTH,
  PROFILE_DESCRIPTION_LENGTH,
} from '../constants/schema'
export class ProfileDto {
  @IsUUID()
  @DtoProperty()
  profileId: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
  @DtoProperty({ required: false })
  legalFullName?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ required: false })
  displayName?: string

  @Length(1, PROFILE_COVER_TITLE_LENGTH)
  @DtoProperty({ required: false })
  coverTitle?: string

  @Length(1, PROFILE_COVER_DESCRIPTION_LENGTH)
  @DtoProperty({ required: false })
  coverDescription?: string

  @Length(1, PROFILE_DESCRIPTION_LENGTH)
  @DtoProperty({ required: false })
  description?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  instagramUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  tiktokUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  youtubeUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  discordUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  twitchUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  facebookUrl?: string

  @DtoProperty({ required: false })
  isKYCVerified?: boolean

  @DtoProperty()
  isActive: boolean

  @DtoProperty({ required: false })
  isAdult?: boolean
  constructor(profile) {
    this.profileId = profile.id
    this.userId = profile.user_id
    this.description = profile.description
    this.legalFullName = profile.legal_full_name
    this.displayName = profile.display_name

    this.coverTitle = profile.cover_title
    this.coverDescription = profile.cover_description

    this.instagramUrl = profile.instagram_url
    this.tiktokUrl = profile.tiktok_url
    this.youtubeUrl = profile.youtube_url
    this.discordUrl = profile.discord_url
    this.twitchUrl = profile.twitch_url

    this.isKYCVerified = profile.is_kycverified
    this.isActive = profile.is_active
    this.isAdult = profile.is_adult
  }
}
