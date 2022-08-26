import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { WalletEntity } from '../../wallet/entities/wallet.entity'
import { SolNftCollectionEntity } from './sol-nft-collection.entity'

@Entity({ tableName: 'sol_nft' })
export class SolNftEntity extends BaseEntity {
  @ManyToOne()
  solNftCollection: SolNftCollectionEntity

  @ManyToOne()
  wallet?: WalletEntity

  @Property({ length: 255 })
  @Unique()
  mintPublicKey: string

  @Property({ length: 255 })
  metadataPublicKey: string

  @Property({ length: 255 })
  name: string

  @Property({ length: 255 })
  symbol: string

  @Property({ length: 255 })
  uriMetadata: string

  @Property({ length: 255 })
  txSignature: string
}
