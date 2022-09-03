import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ListMemberDto {
  @IsUUID()
  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  @ApiProperty()
  displayName: string

  constructor(listMember) {
    this.userId = listMember.user_id
    this.username = listMember.username
    this.displayName = listMember.display_name
  }
}
