import { SubscriptionEntity } from '../entities/subscription.entity'

export class GetSubscriptionDto {
  id: string
  subscriberId: string
  creatorId: string
  isActive: boolean

  constructor(subscriptionEntity: SubscriptionEntity) {
    this.id = subscriptionEntity.id
    this.subscriberId = subscriptionEntity.subscriber.id
    this.creatorId = subscriptionEntity.creator.id
    this.isActive = subscriptionEntity.isActive
  }
}
