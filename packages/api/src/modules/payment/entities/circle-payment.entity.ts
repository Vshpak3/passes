import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import {
  CIRCLE_ID_LENGTH,
  CIRCLE_IDEMPOTENCY_KEY_LENGTH,
  CIRCLE_MONEY_AMOUNT_STRING_LENGTH,
} from '../constants/schema'
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

  @Property({ length: CIRCLE_IDEMPOTENCY_KEY_LENGTH })
  @Unique()
  idempotencyKey?: string

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circleId?: string

  @Property({ length: CIRCLE_MONEY_AMOUNT_STRING_LENGTH })
  amount: string

  @Enum(() => CircleCardVerificationEnum)
  verification?: CircleCardVerificationEnum

  @Enum(() => CirclePaymentStatusEnum)
  status!: CirclePaymentStatusEnum
}
