import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PaymentCallbackEnum } from '../enum/payment.callback.enum'
import { PaymentStatusEnum } from '../enum/payment.status.enum'
import { ProviderEnum } from '../enum/provider.enum'

@Entity({ tableName: 'payment' })
export class PaymentEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  userId: UserEntity

  @Property()
  providerPaymentId: string

  @Enum(() => ProviderEnum)
  provider: ProviderEnum

  @Property()
  amount: string

  @Enum(() => PaymentStatusEnum)
  paymentStatus: PaymentStatusEnum

  @Enum(() => PaymentCallbackEnum)
  callback: PaymentCallbackEnum

  @Property()
  callbackInputJSON: string

  @Property()
  callbackSuccess?: boolean
}
