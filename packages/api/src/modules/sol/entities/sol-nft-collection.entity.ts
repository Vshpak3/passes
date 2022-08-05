import { Entity, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'sol_nft_collection' })
export class SolNftCollectionEntity extends BaseEntity {
  @Property()
  @Unique()
  publicKey: string

  @Property()
  name: string

  @Property()
  symbol: string

  @Property()
  description: string

  @Property()
  imageUrl: string

  @Property()
  uriMetadata: string

  @Property()
  txSignature: string
}
