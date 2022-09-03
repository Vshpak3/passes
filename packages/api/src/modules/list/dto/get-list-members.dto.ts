import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { ListMemberDto } from './list-member.dto'

export class GetListMembersRequestto {
  @IsUUID()
  @ApiProperty()
  listId: string

  @ApiPropertyOptional()
  cursor?: string
}

export class GetListMembersResponseDto {
  @ApiProperty({ type: [ListMemberDto] })
  listMembers: ListMemberDto[]
}
