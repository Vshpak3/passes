import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../constants/schema'
import { ChainEnum } from '../enum/chain.enum'

@Entity()
@Unique({ properties: ['chain', 'address'] })
export class WalletEntity extends BaseEntity {
  static table = 'wallet'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string | null

  @Property({ length: BLOCKCHAIN_ADDRESS_LENGTH })
  address: string

  @Enum(() => ChainEnum)
  chain: ChainEnum

  @Property({ default: false })
  custodial: boolean

  @Property({ default: true })
  authenticated: boolean
}
