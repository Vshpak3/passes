import { ApiProperty } from '@nestjs/swagger'

export class GetChannelResponseDto {
  @ApiProperty()
  channelId: string

  @ApiProperty()
  blocked: boolean
}
