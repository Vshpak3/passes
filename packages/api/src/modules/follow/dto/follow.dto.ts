import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
export class FollowDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @IsUUID()
  @ApiProperty()
  followerId: string

  @IsUUID()
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
