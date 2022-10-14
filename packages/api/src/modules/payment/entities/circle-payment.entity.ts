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

@Entity()
export class CirclePaymentEntity extends BaseEntity {
  static table = 'circle_payment'
  @ManyToOne({ entity: () => CircleCardEntity })
  card_id: string

  @OneToOne({ entity: () => PayinEntity })
  payin_id: string

  @Property({ length: CIRCLE_IDEMPOTENCY_KEY_LENGTH })
  @Unique()
  idempotency_key: string | null

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circle_id: string | null

  @Property({ length: CIRCLE_MONEY_AMOUNT_STRING_LENGTH })
  amount: string

  @Enum(() => CircleCardVerificationEnum)
  verification: CircleCardVerificationEnum | null

  @Enum(() => CirclePaymentStatusEnum)
  status!: CirclePaymentStatusEnum
}
