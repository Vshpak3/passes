import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateProfileRequestDto {
  @ApiPropertyOptional()
  displayName?: string

  @ApiPropertyOptional()
  coverTitle?: string

  @ApiPropertyOptional()
  coverDescription?: string

  @ApiPropertyOptional()
  description?: string

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
