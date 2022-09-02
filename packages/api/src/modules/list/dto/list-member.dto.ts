import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ListMemberDto {
  @IsUUID()
  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  constructor(userId: string, username: string) {
    this.userId = userId
    this.username = username
  }
}
