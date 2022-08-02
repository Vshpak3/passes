import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PaymentCallbackEnum } from '../enum/payment.callback.enum'
import { PaymentStatusEnum } from '../enum/payment.status.enum'
import { ProviderAccountTypeEnum, ProviderEnum } from '../enum/provider.enum'

@Entity({ tableName: 'payment' })
export class PaymentEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  // provider
  @Property()
  @Unique()
  providerPaymentId: string

  @Enum(() => ProviderAccountTypeEnum)
  providerType: ProviderAccountTypeEnum

  @Enum(() => ProviderEnum)
  provider: ProviderEnum

  // transaction
  @Property()
  amount: string

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
