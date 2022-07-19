import { ApiProperty } from '@nestjs/swagger'

export class CreateChannelDto {
  @ApiProperty()
  text: string

  @ApiProperty()
  username: string
}
