import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { CircleCardVerificationEnum } from '../enum/circle-card.verification.enum'
import { CirclePaymentStatusEnum } from '../enum/circle-payment.status.enum'
import { CircleCardEntity } from './circle-card.entity'
import { PayinEntity } from './payin.entity'

@Entity({ tableName: 'circle_payment' })
export class CirclePaymentEntity extends BaseEntity {
  @ManyToOne({ entity: () => CircleCardEntity })
  card: CircleCardEntity

  @OneToOne({ entity: () => PayinEntity })
  payin: PayinEntity

  @Property()
  @Unique()
  idempotencyKey?: string

  @Property()
  @Unique()
  circlePaymentId?: string

  @Property()
  amount: string

  @Enum(() => CircleCardVerificationEnum)
  verification?: CircleCardVerificationEnum

  @Enum(() => CirclePaymentStatusEnum)
  status!: CirclePaymentStatusEnum
}
