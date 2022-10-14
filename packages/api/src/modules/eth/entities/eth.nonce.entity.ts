import { Entity, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ETH_WALLET_KEY_LENGTH } from '../constants/schema'

@Entity()
export class EthNonceEntity extends BaseEntity {
  static table = 'eth_nonce'

  @Unique()
  @Property({ length: ETH_WALLET_KEY_LENGTH })
  key_identifier: string

  @Property()
  nonce: number
}
