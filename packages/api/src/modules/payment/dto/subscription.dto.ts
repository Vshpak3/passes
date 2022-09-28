import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PassDto } from '../../pass/dto/pass.dto'
import { PassHolderDto } from '../../pass/dto/pass-holder.dto'
import { SubscriptionEntity } from '../entities/subscription.entity'
import { SubscriptionStatusEnum } from '../enum/subscription.status.enum'
import { CircleCardDto } from './circle/circle-card.dto'
import { PayinMethodDto } from './payin-method.dto'

export class SubscriptionDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'uuid' })
  userId: string

  @DtoProperty({ custom_type: PayinMethodDto })
  payinMethod: PayinMethodDto

  @DtoProperty({ custom_type: SubscriptionStatusEnum })
  subscriptionStatus: SubscriptionStatusEnum

  @Min(0)
  @DtoProperty({ type: 'number' })
  amount: number

  @DtoProperty({ custom_type: CircleCardDto, optional: true })
  card?: CircleCardDto

  @DtoProperty({ type: 'uuid', optional: true })
  passHolderId?: string

  @DtoProperty({ custom_type: PassHolderDto, optional: true })
  passHolder?: PassHolderDto

  @DtoProperty({ custom_type: PassDto, optional: true })
  pass?: PassDto

  constructor(subscription: SubscriptionEntity | undefined) {
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
