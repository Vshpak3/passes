import { ApiProperty } from '@nestjs/swagger'

export class GetSignedUrlResponseDto {
  @ApiProperty()
  url: string
}
