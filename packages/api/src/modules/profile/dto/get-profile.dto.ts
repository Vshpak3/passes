import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetProfileDto {
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

  constructor(profileEntity) {
    this.id = profileEntity.id
    this.userId = profileEntity.user_id
    this.description = profileEntity.description
    this.legalFullName = profileEntity.user_legal_full_name
    this.displayName = profileEntity.user_display_name

    this.coverTitle = profileEntity.cover_title
    this.coverDescription = profileEntity.cover_description

    this.profileImageUrl = profileEntity.profile_image_url
    this.profileCoverImageUrl = profileEntity.profile_cover_image_url

    this.profileImageUrl = profileEntity.profile_image_url
    this.instagramUrl = profileEntity.instagram_url
    this.tiktokUrl = profileEntity.tiktok_url
    this.youtubeUrl = profileEntity.youtube_url
    this.discordUrl = profileEntity.discord_url
    this.twitchUrl = profileEntity.twitch_url

    this.isKYCVerified = profileEntity.user_is_kycverified
    this.isActive = profileEntity.is_active
  }
}
