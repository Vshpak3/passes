import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core'

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

@Entity()
@Unique({ properties: ['user_id', 'pass_holder_id'] })
export class SubscriptionEntity extends BaseEntity {
  static table = 'subscription'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Enum(() => SubscriptionStatusEnum)
  subscription_status: SubscriptionStatusEnum

  // payin method
  @Enum(() => PayinMethodEnum)
  payin_method: PayinMethodEnum

  @ManyToOne({ entity: () => CircleCardEntity })
  card_id: string | null

  @Property()
  chain_id: number | null

  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number

  // card specific information
  @Property({ length: IP_ADDRESS_LENGTH })
  ip_address: string | null

  @Property({ length: SHA256_LENGTH })
  session_id: string | null

  @Property({ length: SHA256_LENGTH })
  target: string

  @ManyToOne({ entity: () => PassHolderEntity })
  pass_holder_id: string
}
