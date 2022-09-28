import { DtoProperty } from '../../../web/dto.web'
import { FollowEntity } from '../entities/follow.entity'
export class FollowDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'uuid' })
  followerId: string

  @DtoProperty({ type: 'uuid' })
  creatorId: string

  constructor(follow: FollowEntity) {
    this.id = follow.id
    this.followerId = follow.follower_id
    this.creatorId = follow.creator_id
  }
}
