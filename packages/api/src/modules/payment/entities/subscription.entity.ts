import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PassHolderEntity } from '../../pass/entities/pass-holder.entity'
import { UserEntity } from '../../user/entities/user.entity'
import {
  IP_ADDRESS_LENGTH,
  SHA256_LENGTH,
  USD_AMOUNT_TYPE,
} from '../constants/schema'
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

  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number

  // card specific information
  @Property({ length: IP_ADDRESS_LENGTH })
  ipAddress?: string

  @Property({ length: SHA256_LENGTH })
  sessionId?: string

  @ManyToOne({ entity: () => PassHolderEntity })
  passHolder: PassHolderEntity
}
