import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  Property,
  types,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { PayinCallbackInput, PayinCallbackOutput } from '../callback.types'
import {
  SHA256_LENGTH,
  TRANSACTION_HASH_LENGTH,
  USD_AMOUNT_TYPE,
} from '../constants/schema'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinStatusEnum } from '../enum/payin.status.enum'
import { PayinMethodEnum } from '../enum/payin-method.enum'
import { CircleCardEntity } from './circle-card.entity'

@Entity({ tableName: 'payin' })
export class PayinEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  // payin method
  @Enum(() => PayinMethodEnum)
  payinMethod: PayinMethodEnum

  @ManyToOne({ entity: () => CircleCardEntity })
  card?: CircleCardEntity

  @Property()
  chainId?: number

  @Property({ length: BLOCKCHAIN_ADDRESS_LENGTH })
  address?: string

  @Property({ length: TRANSACTION_HASH_LENGTH })
  transactionHash?: string

  // transaction information
  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number

  @Property({ type: types.float })
  convertedAmount?: number

  @Enum(() => PayinStatusEnum)
  payinStatus: PayinStatusEnum

  // callback
  @Enum(() => PayinCallbackEnum)
  callback: PayinCallbackEnum

  @Property({ type: types.json })
  callbackInputJSON: PayinCallbackInput

  @Property({ type: types.json })
  callbackOutputJSON?: PayinCallbackOutput

  // payin target

  // ensure that someone isn't paying for the same "target"
  // while payin is inprogress
  @Property({ length: SHA256_LENGTH })
  target?: string
}
