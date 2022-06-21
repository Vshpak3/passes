import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity()
export class Pass extends BaseEntity {
  @Property()
  profileId: number

  @Property()
  walletAddress: string

  @Property()
  description: string

  @Property()
  blockchain: string

  @Property()
  contractAddress: string

  @Property()
  tokenId: number

  @Property()
  numViews: number

  @Property()
  numFavorites: number

  @Property()
  rarityRank: number

  @Property()
  price: Float64Array

  @Property()
  paid: Float32Array
}
