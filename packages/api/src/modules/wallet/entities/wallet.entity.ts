import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { WALLET_ADDRESS_LENGTH } from '../constants/schema'
import { ChainEnum } from '../enum/chain.enum'

@Entity({ tableName: 'wallet' })
@Unique({ properties: ['chain', 'address'] })
export class WalletEntity extends BaseEntity {
  @ManyToOne()
  user?: UserEntity

  @Property({ length: WALLET_ADDRESS_LENGTH })
  address: string

  @Enum(() => ChainEnum)
  chain: ChainEnum

  @Property({ default: false })
  custodial = false

  @Property({ default: true })
  authenticated = true
}
