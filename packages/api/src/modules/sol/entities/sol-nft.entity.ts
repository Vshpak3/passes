import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { SolNftCollectionEntity } from './sol-nft-collection.entity'

@Entity({ tableName: 'sol_nft' })
export class SolNftEntity extends BaseEntity {
  @ManyToOne({ entity: () => SolNftCollectionEntity })
  solNftCollection: SolNftCollectionEntity

  @Property()
  @Unique()
  mintPublicKey: string

  @Property()
  metadataPublicKey: string

  @Property()
  name: string

  @Property()
  symbol: string

  @Property()
  uriMetadata: string

  @Property()
  txSignature: string
}
