import { ApiProperty } from '@nestjs/swagger'

export class GetUsernamesDto {
  @ApiProperty()
  usernames: string[]
}
