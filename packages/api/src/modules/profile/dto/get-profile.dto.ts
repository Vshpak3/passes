import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ProfileEntity } from '../entities/profile.entity'

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

  constructor(profileEntity: ProfileEntity) {
    this.id = profileEntity.id
    this.userId = profileEntity.user.id
    this.description = profileEntity.description
    this.fullName = profileEntity.user.fullName
    this.isKYCVerified = profileEntity.user.isKYCVerified
    this.profileImageUrl = profileEntity.profileImageUrl
    this.instagramUrl = profileEntity.instagramUrl
    this.tiktokUrl = profileEntity.tiktokUrl
    this.youtubeUrl = profileEntity.youtubeUrl
    this.discordUrl = profileEntity.discordUrl
    this.twitchUrl = profileEntity.twitchUrl
    this.isActive = profileEntity.isActive
  }
}
