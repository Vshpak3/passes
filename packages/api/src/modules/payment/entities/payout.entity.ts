import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { WalletEntity } from '../../wallet/entities/wallet.entity'
import { TRANSACTION_HASH_LENGTH, USD_AMOUNT_TYPE } from '../constants/schema'
import { PayoutStatusEnum } from '../enum/payout.status.enum'
import { PayoutMethodEnum } from '../enum/payout-method.enum'
import { CircleBankEntity } from './circle-bank.entity'

@Entity()
export class PayoutEntity extends BaseEntity {
  static table = 'payout'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  // payin method
  @ManyToOne({ entity: () => CircleBankEntity })
  bank_id: string | null

  @ManyToOne({ entity: () => WalletEntity })
  wallet_id: string | null

  @Enum(() => PayoutMethodEnum)
  payout_method: PayoutMethodEnum

  @Property({ length: TRANSACTION_HASH_LENGTH })
  transaction_hash: string | null

  // transaction information
  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number

  @Enum(() => PayoutStatusEnum)
  payout_status: PayoutStatusEnum
}
