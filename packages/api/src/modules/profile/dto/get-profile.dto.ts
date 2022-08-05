import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetProfileDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiPropertyOptional()
  fullName?: string

  @ApiPropertyOptional()
  isKYCVerified?: boolean

  @ApiPropertyOptional()
  description?: string

  @ApiPropertyOptional()
  profileImageUrl?: string

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

  @ApiProperty()
  isActive: boolean

  constructor(profileEntity) {
    this.id = profileEntity.id
    this.userId = profileEntity.user_id
    this.description = profileEntity.description
    this.fullName = profileEntity.user_full_name
    this.isKYCVerified = profileEntity.user_is_kycverified
    this.profileImageUrl = profileEntity.profile_image_url
    this.instagramUrl = profileEntity.instagram_url
    this.tiktokUrl = profileEntity.tiktok_url
    this.youtubeUrl = profileEntity.youtube_url
    this.discordUrl = profileEntity.discord_url
    this.twitchUrl = profileEntity.twitch_url
    this.isActive = profileEntity.is_active
  }
}
