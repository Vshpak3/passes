import { ApiProperty } from '@nestjs/swagger'

export class RawFacebookDeletionRequestDto {
  @ApiProperty()
  signed_request: string
}
