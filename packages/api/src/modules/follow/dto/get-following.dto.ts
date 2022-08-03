import { FollowEntity } from '../entities/follow.entity'

export class GetFollowingDto {
  id: string
  subscriberId: string
  creatorId: string
  isActive: boolean

  constructor(followEntity: FollowEntity) {
    this.id = followEntity.id
    this.subscriberId = followEntity.subscriber.id
    this.creatorId = followEntity.creator.id
    this.isActive = followEntity.isActive
  }
}
