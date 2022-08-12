import { Entity, Enum, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PayinCallbackInput } from '../callback.types'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinMethodEnum } from '../enum/payin.enum'
import { PayinStatusEnum } from '../enum/payin.status.enum'
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

  @Property()
  address?: string

  @Property()
  transactionHash?: string

  // transaction information
  @Property({ type: types.float })
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
}
