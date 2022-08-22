import { Entity, OneToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { WalletEntity } from './wallet.entity'

@Entity({ tableName: 'default_wallet' })
export class DefaultWalletEntity extends BaseEntity {
  @OneToOne()
  user: UserEntity

  @OneToOne()
  wallet: WalletEntity
}
