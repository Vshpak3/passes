import { ApiProperty } from '@nestjs/swagger'

export class CreateContentRequestDto {
  @ApiProperty()
  url: string

  @ApiProperty()
  contentType: string
}
