import { Entity, Enum, OneToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ChainEnum } from '../enum/chain.enum'
import { WalletEntity } from './wallet.entity'

@Entity({ tableName: 'default_wallet' })
@Unique({ properties: ['user', 'chain'] })
export class DefaultWalletEntity extends BaseEntity {
  @OneToOne()
  user: UserEntity

  @OneToOne()
  wallet: WalletEntity

  @Enum(() => ChainEnum)
  chain: ChainEnum
}
