import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { SubscriptionStatusEnum } from '../enum/subscription.status.enum'
import { CircleCardDto } from './circle/circle-card.dto'
import { PayinMethodDto } from './payin-method.dto'
import { PayinTargetDto } from './payin-target.dto'

export class SubscriptionDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  payinMethod: PayinMethodDto

  @ApiProperty({ enum: SubscriptionStatusEnum })
  subscriptionStatus: SubscriptionStatusEnum

  @ApiProperty()
  amount: number

  @ApiPropertyOptional()
  card?: CircleCardDto

  @ApiPropertyOptional()
  payinTarget?: PayinTargetDto

  constructor(subscription) {
    if (subscription) {
      this.id = subscription.id
      this.userId = subscription.user_id
      this.payinMethod = {
        method: subscription.payin_method,
        cardId: subscription.card_id,
        chainId: subscription.chain_id,
      }
      this.amount = subscription.amount
      this.payinTarget = {
        target: subscription.target,
        passId: subscription.pass_id,
        passOwnershipId: subscription.pass_ownership_id,
      }
    }
  }
}
