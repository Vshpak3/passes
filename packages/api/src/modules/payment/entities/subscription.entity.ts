import { Entity, Enum, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PassHolderEntity } from '../../pass/entities/pass-holder.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PayinMethodEnum } from '../enum/payin-method.enum'
import { SubscriptionStatusEnum } from '../enum/subscription.status.enum'
import { CircleCardEntity } from './circle-card.entity'

@Entity({ tableName: 'subscription' })
export class SubscriptionEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Enum(() => SubscriptionStatusEnum)
  subscriptionStatus: SubscriptionStatusEnum

  // payin method
  @Enum(() => PayinMethodEnum)
  payinMethod: PayinMethodEnum

  @ManyToOne({ entity: () => CircleCardEntity })
  card?: CircleCardEntity

  @Property()
  chainId?: number

  @Property({ type: types.float })
  amount: number

  // card specific information
  @Property()
  ipAddress?: string

  @Property()
  sessionId?: string

  @ManyToOne({ entity: () => PassHolderEntity })
  passHolder: PassHolderEntity
}
