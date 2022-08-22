import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { Chain } from '../enum/chain.enum'

@Entity({ tableName: 'wallet' })
@Unique({ properties: ['chain', 'address'] })
export class WalletEntity extends BaseEntity {
  @ManyToOne()
  user?: UserEntity

  @Property()
  address: string

  @Property()
  chain: Chain

  @Property({ default: false })
  custodial = false

  @Property({ default: true })
  authenticated = true
}
