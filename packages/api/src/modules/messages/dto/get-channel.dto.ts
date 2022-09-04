import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetChannelRequestDto {
  @ApiProperty()
  username: string

  @ApiPropertyOptional()
  userId?: string
}

export class GetChannelResponseDto {
  @ApiProperty()
  channelId: string

  @ApiProperty()
  blocked: boolean
}
