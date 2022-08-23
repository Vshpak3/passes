import { ApiProperty } from '@nestjs/swagger'

export class ListMembersDto {
  @ApiProperty()
  users: string[]
}
