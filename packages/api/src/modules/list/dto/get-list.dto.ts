import { ApiProperty } from '@nestjs/swagger'

import { GetListMemberDto } from './get-list-member.dto'

export class GetListDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  listMembers: GetListMemberDto[]

  @ApiProperty()
  size: number

  constructor(
    id: string,
    name: string,
    listMembers: GetListMemberDto[],
    size: number,
  ) {
    this.id = id
    this.name = name
    this.listMembers = listMembers
    this.size = size
  }
}
