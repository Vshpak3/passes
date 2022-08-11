import { ApiProperty } from '@nestjs/swagger'

export class RemoveListMemberDto {
  @ApiProperty()
  list: string

  @ApiProperty()
  user: string
}
