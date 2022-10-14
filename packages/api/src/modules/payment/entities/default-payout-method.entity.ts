import { Entity, Enum, OneToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { WalletEntity } from '../../wallet/entities/wallet.entity'
import { PayoutMethodEnum } from '../enum/payout-method.enum'
import { CircleBankEntity } from './circle-bank.entity'

@Entity()
export class DefaultPayoutMethodEntity extends BaseEntity {
  static table = 'default_payout_method'
  @OneToOne({ entity: () => UserEntity })
  user_id: string

  @Enum(() => PayoutMethodEnum)
  method: PayoutMethodEnum

  @OneToOne({ entity: () => CircleBankEntity })
  bank_id: string | null

  @OneToOne({ entity: () => WalletEntity })
  wallet_id: string | null
}
