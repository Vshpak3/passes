import { Entity, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'sol_nft_collection' })
export class SolNftCollectionEntity extends BaseEntity {
  @Property({ length: 255 })
  @Unique()
  publicKey: string

  @Property({ length: 255 })
  name: string

  @Property({ length: 255 })
  symbol: string

  @Property({ length: 255 })
  description: string

  @Property({ length: 255 })
  imageUrl: string

  @Property({ length: 255 })
  uriMetadata: string

  @Property({ length: 255 })
  txSignature: string
}
