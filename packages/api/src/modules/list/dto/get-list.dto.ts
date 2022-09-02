import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { ListMemberDto } from './list-member.dto'

export class GetListResponseDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  listMembers: ListMemberDto[]

  @ApiProperty()
  size: number

  constructor(
    id: string,
    name: string,
    listMembers: ListMemberDto[],
    size: number,
  ) {
    this.id = id
    this.name = name
    this.listMembers = listMembers
    this.size = size
  }
}
