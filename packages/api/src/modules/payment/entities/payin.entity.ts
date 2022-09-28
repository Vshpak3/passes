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
  user_id: string

  // payin method
  @Enum(() => PayinMethodEnum)
  payin_method: PayinMethodEnum

  @ManyToOne({ entity: () => CircleCardEntity })
  card_id: string | null

  @Property()
  chain_id: number | null

  @Property({ length: BLOCKCHAIN_ADDRESS_LENGTH })
  address: string | null

  @Property({ length: TRANSACTION_HASH_LENGTH })
  transaction_hash: string | null

  // transaction information
  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number

  @Property({ type: types.float })
  converted_amoun: number | null

  @Enum(() => PayinStatusEnum)
  payin_status: PayinStatusEnum

  // callback
  @Enum(() => PayinCallbackEnum)
  callback: PayinCallbackEnum

  @Property({ type: types.json })
  callback_input_json: PayinCallbackInput

  @Property({ type: types.json })
  callback_output_json: PayinCallbackOutput | null

  // payin target

  // ensure that someone isn't paying for the same "target"
  // while payin is inprogress
  @Property({ length: SHA256_LENGTH })
  target: string | null
}
