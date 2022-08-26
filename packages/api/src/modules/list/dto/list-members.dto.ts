import { ApiProperty } from '@nestjs/swagger'

export class ListMembersRequestDto {
  @ApiProperty()
  users: string[]
}

export class AddListMembersRequestDto extends ListMembersRequestDto {}
export class RemoveListMembersRequestDto extends ListMembersRequestDto {}
