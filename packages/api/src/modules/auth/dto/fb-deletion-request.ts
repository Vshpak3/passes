import { ApiProperty } from '@nestjs/swagger'

export class FacebookDeletionRequestDto {
  @ApiProperty()
  user_id: string
}
