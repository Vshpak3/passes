import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
export class ProfileDto {
  @IsUUID()
  @DtoProperty()
  profileId: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty({ required: false })
  legalFullName?: string

  @DtoProperty({ required: false })
  displayName?: string

  @DtoProperty({ required: false })
  coverTitle?: string

  @DtoProperty({ required: false })
  coverDescription?: string

  @DtoProperty({ required: false })
  description?: string

  @DtoProperty({ required: false })
  instagramUrl?: string

  @DtoProperty({ required: false })
  tiktokUrl?: string

  @DtoProperty({ required: false })
  youtubeUrl?: string

  @DtoProperty({ required: false })
  discordUrl?: string

  @DtoProperty({ required: false })
  twitchUrl?: string

  @DtoProperty({ required: false })
  isKYCVerified?: boolean

  @DtoProperty()
  isActive: boolean

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
  }
}
