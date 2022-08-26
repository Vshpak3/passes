import { ApiProperty } from '@nestjs/swagger'

export class FollowDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  subscriberId: string

  @ApiProperty()
  creatorId: string

  @ApiProperty()
  isActive: boolean

  constructor(follow) {
    this.id = follow.id
    this.subscriberId = follow.subscriber_id
    this.creatorId = follow.creator_id
    this.isActive = follow.is_active
  }
}
