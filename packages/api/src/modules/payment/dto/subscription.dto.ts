import { IsEnum, IsUUID, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PassDto } from '../../pass/dto/pass.dto'
import { PassHolderDto } from '../../pass/dto/pass-holder.dto'
import { SubscriptionStatusEnum } from '../enum/subscription.status.enum'
import { CircleCardDto } from './circle/circle-card.dto'
import { PayinMethodDto } from './payin-method.dto'

export class SubscriptionDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  payinMethod: PayinMethodDto

  @IsEnum(SubscriptionStatusEnum)
  @DtoProperty({ enum: SubscriptionStatusEnum })
  subscriptionStatus: SubscriptionStatusEnum

  @Min(0)
  @DtoProperty()
  amount: number

  @DtoProperty({ required: false })
  card?: CircleCardDto

  @IsUUID()
  @DtoProperty({ required: false })
  passHolderId?: string

  @DtoProperty({ required: false })
  passHolder?: PassHolderDto

  @DtoProperty({ required: false })
  pass?: PassDto

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
