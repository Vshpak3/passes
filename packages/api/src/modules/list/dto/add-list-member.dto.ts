import { ApiProperty } from '@nestjs/swagger'

export class AddListMemberDto {
  @ApiProperty()
  list: string

  @ApiProperty()
  user: string
}
