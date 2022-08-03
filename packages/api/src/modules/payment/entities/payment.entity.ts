import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PayinMethodEnum } from '../enum/payin.enum'
import { PaymentCallbackEnum } from '../enum/payment.callback.enum'
import { PaymentStatusEnum } from '../enum/payment.status.enum'

@Entity({ tableName: 'payment' })
export class PaymentEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  // payin method
  @Property()
  payinMethodId?: string

  @Enum(() => PayinMethodEnum)
  payinMethod: PayinMethodEnum

  // transaction information
  @Property()
  amount: number

  @Enum(() => PaymentStatusEnum)
  paymentStatus: PaymentStatusEnum

  // callback
  @Enum(() => PaymentCallbackEnum)
  callback: PaymentCallbackEnum

  @Property()
  callbackInputJSON: string

  @Property()
  callbackSuccess?: boolean
}
