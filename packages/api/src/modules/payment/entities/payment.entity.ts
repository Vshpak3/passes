import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { CardVerificationEnum } from '../enum/card.verification.enum'
import { PaymentSourceEnum } from '../enum/payment.source.enum'
import { PaymentStatusEnum } from '../enum/payment.status.enum'
import { CardEntity } from './card.entity'
import { CircleAddressEntity } from './circle-address.entity'

@Entity({ tableName: 'payment' })
export class PaymentEntity extends BaseEntity {
  @ManyToOne({ entity: () => CardEntity })
  card?: CardEntity

  @ManyToOne()
  address?: CircleAddressEntity

  @Property()
  @Unique()
  idempotencyKey?: string

  @Property()
  @Unique()
  circlePaymentId: string

  @Property()
  amount: string

  @Enum(() => CardVerificationEnum)
  verification?: CardVerificationEnum

  @Enum(() => PaymentStatusEnum)
  status!: PaymentStatusEnum

  @Enum(() => PaymentSourceEnum)
  source!: PaymentSourceEnum
}
