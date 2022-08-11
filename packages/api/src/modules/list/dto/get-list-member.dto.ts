import { ApiProperty } from '@nestjs/swagger'

export class GetListMemberDto {
  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  constructor(userId: string, username: string) {
    this.userId = userId
    this.username = username
  }
}
