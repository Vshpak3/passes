export class GetFollowingDto {
  id: string
  subscriberId: string
  creatorId: string
  isActive: boolean

  constructor(followEntity) {
    this.id = followEntity.id
    this.subscriberId = followEntity.subscriber_id
    this.creatorId = followEntity.creator_id
    this.isActive = followEntity.is_active
  }
}
