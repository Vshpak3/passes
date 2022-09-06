import { Entity, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ETH_ADDRESS_LENGTH, ETH_COLLECTION_LENGTH } from '../constants/schema'

@Entity({ tableName: 'eth_nft_collection' })
export class EthNftCollectionEntity extends BaseEntity {
  @Property({ length: ETH_ADDRESS_LENGTH })
  @Unique()
  tokenAddress: string

  @Property({ length: ETH_COLLECTION_LENGTH })
  name: string
}
