import { DtoProperty } from '../../../web/dto.web'
import { SubscriptionDto } from './subscription.dto'

export class GetSubscriptionsResponseDto {
  @DtoProperty({ type: [SubscriptionDto] })
  subscriptions: SubscriptionDto[]

  constructor(subscriptions: SubscriptionDto[]) {
    this.subscriptions = subscriptions
  }
}
