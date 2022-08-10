import { ApiProperty } from '@nestjs/swagger'

export class GetFollowingDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  subscriberId: string

  @ApiProperty()
  creatorId: string

  @ApiProperty()
  isActive: boolean

  constructor(followEntity) {
    this.id = followEntity.id
    this.subscriberId = followEntity.subscriber_id
    this.creatorId = followEntity.creator_id
    this.isActive = followEntity.is_active
  }
}
