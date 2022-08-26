import { ApiProperty } from '@nestjs/swagger'

export class CreateChannelRequestDto {
  @ApiProperty()
  text: string

  @ApiProperty()
  username: string
}
