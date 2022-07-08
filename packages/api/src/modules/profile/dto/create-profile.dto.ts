import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateProfileDto {
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
}
