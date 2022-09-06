import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { WalletEntity } from '../../wallet/entities/wallet.entity'
import { ETH_TOKEN_ID_LENGTH } from '../constants/schema'
import { EthNftCollectionEntity } from './eth-nft-collection.entity'

@Entity({ tableName: 'eth_nft' })
@Unique({ properties: ['ethNftCollection', 'tokenId'] })
export class EthNftEntity extends BaseEntity {
  @ManyToOne()
  wallet: WalletEntity

  @ManyToOne()
  ethNftCollection: EthNftCollectionEntity

  @Property({ length: ETH_TOKEN_ID_LENGTH })
  tokenId: string

  @Property({ length: 255 })
  tokenHash?: string
}
