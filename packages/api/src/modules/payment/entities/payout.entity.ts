import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { WalletEntity } from '../../wallet/entities/wallet.entity'
import { TRANSACTION_HASH_LENGTH, USD_AMOUNT_TYPE } from '../constants/schema'
import { PayoutStatusEnum } from '../enum/payout.status.enum'
import { PayoutMethodEnum } from '../enum/payout-method.enum'
import { CircleBankEntity } from './circle-bank.entity'

@Entity({ tableName: 'payout' })
export class PayoutEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  // payin method
  @ManyToOne({ entity: () => CircleBankEntity })
  bank?: CircleBankEntity

  @ManyToOne({ entity: () => WalletEntity })
  wallet?: WalletEntity

  @Enum(() => PayoutMethodEnum)
  payoutMethod: PayoutMethodEnum

  @Property({ length: TRANSACTION_HASH_LENGTH })
  transactionHash?: string

  // transaction information
  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE })
  amount?: number

  @Enum(() => PayoutStatusEnum)
  payoutStatus: PayoutStatusEnum
}
