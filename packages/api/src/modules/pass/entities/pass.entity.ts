import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  Property,
  types,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import {
  ETH_AMOUNT_TYPE,
  USD_AMOUNT_TYPE,
} from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import {
  PASS_DESCRIPTION_LENGTH,
  PASS_SYMBOL_LENGTH,
  PASS_TITLE_LENGTH,
} from '../constants/schema'
import { AccessTypeEnum } from '../enum/access.enum'
import { PassTypeEnum } from '../enum/pass.enum'
import { PassAnimationEnum } from '../enum/pass-animation.enum'
import { PassImageEnum } from '../enum/pass-image.enum'

@Entity()
export class PassEntity extends BaseEntity {
  static table = 'pass'

  @ManyToOne({ entity: () => UserEntity })
  creator_id: string | null

  @Property({ length: PASS_TITLE_LENGTH })
  title: string

  @Property({ length: PASS_DESCRIPTION_LENGTH })
  description: string

  @Property({ length: PASS_SYMBOL_LENGTH })
  symbol: string

  @Enum(() => PassTypeEnum)
  type: PassTypeEnum

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  price: number

  @Property({ columnType: ETH_AMOUNT_TYPE })
  eth_price: number | null

  @Property({ type: types.bigint })
  duration: number | null

  @Property({ default: false })
  freetrial: boolean

  @Index()
  @Property({ length: 3 })
  pinned_at: Date | null

  @Property()
  total_supply: number | null

  @Property()
  remaining_supply: number | null

  // null means unlimited
  @Property({ default: 0 })
  messages: number | null

  @Property({ length: BLOCKCHAIN_ADDRESS_LENGTH })
  collection_address: string | null

  @Property({ default: false })
  minted: boolean

  @Enum(() => ChainEnum)
  chain: ChainEnum

  @Property({ default: 0 })
  royalties: number

  @Enum(() => PassAnimationEnum)
  animation_type: PassAnimationEnum | null

  @Enum({ items: () => PassImageEnum, default: PassImageEnum.PNG })
  image_type: PassImageEnum

  @Enum(() => AccessTypeEnum)
  access_type: AccessTypeEnum
}
