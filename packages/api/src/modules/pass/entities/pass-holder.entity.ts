import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { WalletEntity } from '../../wallet/entities/wallet.entity'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { TOKEN_ID_LENGTH } from '../constants/schema'
import { AccessTypeEnum } from '../enum/access.enum'
import { PassAnimationEnum } from '../enum/pass-animation.enum'
import { PassImageEnum } from '../enum/pass-image.enum'
import { PassEntity } from './pass.entity'

@Entity({ tableName: 'pass_holder' })
@Unique({ properties: ['address', 'chain', 'token_id'] })
export class PassHolderEntity extends BaseEntity {
  @ManyToOne({ entity: () => PassEntity })
  pass_id: string

  // redundant info to reduce joins
  // wallet owners to change often
  @ManyToOne({ entity: () => UserEntity })
  holder_id: string | null

  @ManyToOne({ entity: () => WalletEntity })
  wallet_id: string | null

  @Property()
  expires_at: Date | null

  // null means unlimited
  @Index()
  @Property({ default: 0 })
  messages: number | null

  @Property({ length: BLOCKCHAIN_ADDRESS_LENGTH })
  address: string

  @Enum(() => ChainEnum)
  chain: ChainEnum

  // for eth
  @Property({ length: TOKEN_ID_LENGTH })
  token_id: string | null

  @Enum(() => PassAnimationEnum)
  animation_type: PassAnimationEnum | null

  @Enum({ items: () => PassImageEnum, default: PassImageEnum.PNG })
  image_type: PassImageEnum

  @Enum(() => AccessTypeEnum)
  access_type: AccessTypeEnum
}
