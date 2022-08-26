import { ApiProperty } from '@nestjs/swagger'

export class CreateFollowingRequestDto {
  @ApiProperty()
  creatorUserId: string

  @ApiProperty()
  isActive: boolean
}
