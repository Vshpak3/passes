import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ProfileDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiPropertyOptional()
  legalFullName?: string

  @ApiPropertyOptional()
  displayName?: string

  @ApiPropertyOptional()
  coverTitle?: string

  @ApiPropertyOptional()
  coverDescription?: string

  @ApiPropertyOptional()
  description?: string

  @ApiPropertyOptional()
  profileImageUrl?: string

  @ApiPropertyOptional()
  profileCoverImageUrl?: string

  @ApiPropertyOptional()
  instagramUrl?: string

  @ApiPropertyOptional()
  tiktokUrl?: string

  @ApiPropertyOptional()
  youtubeUrl?: string

  @ApiPropertyOptional()
  discordUrl?: string

  @ApiPropertyOptional()
  twitchUrl?: string

  @ApiPropertyOptional()
  isKYCVerified?: boolean

  @ApiProperty()
  isActive: boolean

  constructor(profile) {
    this.id = profile.id
    this.userId = profile.user_id
    this.description = profile.description
    this.legalFullName = profile.user_legal_full_name
    this.displayName = profile.user_display_name

    this.coverTitle = profile.cover_title
    this.coverDescription = profile.cover_description

    this.profileImageUrl = profile.profile_image_url
    this.profileCoverImageUrl = profile.profile_cover_image_url

    this.instagramUrl = profile.instagram_url
    this.tiktokUrl = profile.tiktok_url
    this.youtubeUrl = profile.youtube_url
    this.discordUrl = profile.discord_url
    this.twitchUrl = profile.twitch_url

    this.isKYCVerified = profile.user_is_kycverified
    this.isActive = profile.is_active
  }
}
