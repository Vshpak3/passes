import { ApiProperty } from '@nestjs/swagger'

export class CreateContentDto {
  @ApiProperty()
  url: string

  @ApiProperty()
  contentType: string
}
