import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class RemoveListMembersRequestDto {
  @IsUUID()
  @ApiProperty()
  listId: string

  @ApiProperty()
  userIds: string[]
}
