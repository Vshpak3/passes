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
import { PassEntity } from './pass.entity'

@Entity({ tableName: 'pass_holder' })
@Unique({ properties: ['address', 'chain', 'tokenId'] })
export class PassHolderEntity extends BaseEntity {
  @ManyToOne()
  pass: PassEntity

  // redundant info to reduce joins
  // wallet owners to change often
  @ManyToOne()
  holder?: UserEntity

  @ManyToOne()
  wallet: WalletEntity

  @Property()
  expiresAt?: Date

  // null means unlimited
  @Index()
  @Property({ default: 0 })
  messages?: number

  @Property({ length: BLOCKCHAIN_ADDRESS_LENGTH })
  address: string

  @Enum(() => ChainEnum)
  chain: ChainEnum

  // for eth
  @Property({ length: TOKEN_ID_LENGTH })
  tokenId?: string
}
