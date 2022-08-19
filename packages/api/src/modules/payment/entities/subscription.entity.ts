import { Entity, Enum, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PassEntity } from '../../pass/entities/pass.entity'
import { PassOwnershipEntity } from '../../pass/entities/pass-ownership.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PayinMethodEnum } from '../enum/payin-method.enum'
import { SubscriptionStatusEnum } from '../enum/subscription.status.enum'
import { CircleCardEntity } from './circle-card.entity'

@Entity({ tableName: 'subscription' })
export class SubscriptionEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  // payin method
  @Enum(() => PayinMethodEnum)
  payinMethod: PayinMethodEnum

  @ManyToOne({ entity: () => CircleCardEntity })
  card?: CircleCardEntity

  @Property()
  chainId?: number

  @Property({ type: types.float })
  amount: number

  @Enum(() => SubscriptionStatusEnum)
  subscriptionStatus: SubscriptionStatusEnum

  // card specific information
  @Property()
  ipAddress?: string

  @Property()
  sessionId?: string

  // payin target
  @Property()
  target?: string

  @ManyToOne({ entity: () => PassEntity })
  pass?: PassEntity

  @ManyToOne({ entity: () => PassOwnershipEntity })
  passOwnership?: PassOwnershipEntity
}
