import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { Chain } from '../enum/chain.enum'

@Entity({ tableName: 'wallet' })
export class WalletEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Unique()
  @Property()
  address: string

  @Property()
  chain: Chain

  @Property()
  custodial = false
}
