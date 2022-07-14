import { Entity, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'eth_nft_collection' })
export class EthNftCollectionEntity extends BaseEntity {
  @Property()
  @Unique()
  tokenAddress: string

  @Property()
  name: string
}
