import { Entity, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'eth_nft_collection' })
export class EthNftCollectionEntity extends BaseEntity {
  @Property({ length: 255 })
  @Unique()
  tokenAddress: string

  @Property({ length: 255 })
  name: string
}
