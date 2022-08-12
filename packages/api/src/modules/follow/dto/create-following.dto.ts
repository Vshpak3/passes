import { ApiProperty } from '@nestjs/swagger'

export class CreateFollowingDto {
  @ApiProperty()
  creatorUserId: string

  @ApiProperty()
  isActive: boolean
}
