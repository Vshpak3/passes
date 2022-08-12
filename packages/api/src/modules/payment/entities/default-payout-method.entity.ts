import { Entity, Enum, OneToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { WalletEntity } from '../../wallet/entities/wallet.entity'
import { PayoutMethodEnum } from '../enum/payout.enum'
import { CircleBankEntity } from './circle-bank.entity'

@Entity({ tableName: 'default_payout_method' })
export class DefaultPayoutMethodEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user: UserEntity

  @Enum(() => PayoutMethodEnum)
  method: PayoutMethodEnum

  @OneToOne({ entity: () => CircleBankEntity })
  bank?: CircleBankEntity

  @OneToOne({ entity: () => WalletEntity })
  wallet?: WalletEntity
}
