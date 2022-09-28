import { Entity, Enum, OneToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ChainEnum } from '../enum/chain.enum'
import { WalletEntity } from './wallet.entity'

@Entity({ tableName: 'default_wallet' })
@Unique({ properties: ['user_id', 'chain'] })
export class DefaultWalletEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user_id: string

  @OneToOne({ entity: () => WalletEntity })
  wallet_id: string

  @Enum(() => ChainEnum)
  chain: ChainEnum
}
