import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { GetPassDto } from '../../pass/dto/get-pass.dto'
import { GetPassHolderDto } from '../../pass/dto/get-pass-holder.dto'
import { SubscriptionStatusEnum } from '../enum/subscription.status.enum'
import { CircleCardDto } from './circle/circle-card.dto'
import { PayinMethodDto } from './payin-method.dto'

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
  passHolderId?: string

  @ApiPropertyOptional()
  passHolder?: GetPassHolderDto

  @ApiPropertyOptional()
  pass?: GetPassDto

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
      this.passHolderId = subscription.pass_holder_id
    }
  }
}
