import { ApiProperty } from '@nestjs/swagger'

export class GetSignedUrlDto {
  @ApiProperty()
  url: string
}
