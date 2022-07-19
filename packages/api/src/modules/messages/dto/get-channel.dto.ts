import { ApiProperty } from '@nestjs/swagger'

export class GetChannelDto {
  @ApiProperty()
  id: string
}
