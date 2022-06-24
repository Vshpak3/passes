import { Entity, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'pass' })
export class PassEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  // @Property()
  // description: string

  // @Property()
  // walletAddress: string

  // @Property()
  // blockchain: string

  // @Property()
  // contractAddress: string

  // @Property()
  // tokenId: number

  // @Property()
  // numViews: number

  // @Property()
  // numFavorites: number

  // @Property()
  // rarityRank: number

  // @Property()
  // price: Float64Array

  // @Property()
  // paid: Float32Array
}
