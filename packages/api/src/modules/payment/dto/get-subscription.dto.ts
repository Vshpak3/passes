import { ApiProperty } from '@nestjs/swagger'

import { SubscriptionDto } from './subscription.dto'

export class GetSubscriptionsResponseDto {
  @ApiProperty({ type: [SubscriptionDto] })
  subscriptions: SubscriptionDto[]

  constructor(subscriptions: SubscriptionDto[]) {
    this.subscriptions = subscriptions
  }
}
