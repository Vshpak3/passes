import { ApiProperty } from '@nestjs/swagger'

export class FollowDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  followerId: string

  @ApiProperty()
  creatorId: string

  @ApiProperty()
  isActive: boolean

  constructor(follow) {
    this.id = follow.id
    this.followerId = follow.follower_id
    this.creatorId = follow.creator_id
    this.isActive = follow.is_active
  }
}
