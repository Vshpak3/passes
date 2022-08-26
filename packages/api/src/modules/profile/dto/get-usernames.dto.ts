import { ApiProperty } from '@nestjs/swagger'

export class GetUsernamesResponseDto {
  @ApiProperty()
  usernames: string[]
}
