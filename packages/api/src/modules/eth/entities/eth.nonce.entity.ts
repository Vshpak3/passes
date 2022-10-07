import { Entity, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ETH_WALLET_KEY_LENGTH } from '../constants/schema'

@Entity({ tableName: 'eth_nonce' })
@Unique({ properties: ['key_identifier', 'nonce'] })
export class EthNonceEntity extends BaseEntity {
  @Property({ length: ETH_WALLET_KEY_LENGTH })
  key_identifier: string

  @Property()
  nonce: number
}
