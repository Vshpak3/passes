import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateProfileDto {
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
}
