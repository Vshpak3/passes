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
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'
import { CircleBankEntity } from './circle-bank.entity'
import { PayoutEntity } from './payout.entity'

@Entity({ tableName: 'circle_payout' })
export class CirclePayoutEntity extends BaseEntity {
  @ManyToOne({ entity: () => CircleBankEntity })
  bank: CircleBankEntity

  @OneToOne({ entity: () => PayoutEntity })
  payout: PayoutEntity

  @Property({ length: CIRCLE_IDEMPOTENCY_KEY_LENGTH })
  @Unique()
  idempotencyKey?: string

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circleId?: string

  @Property({ length: CIRCLE_MONEY_AMOUNT_STRING_LENGTH })
  fee?: string

  @Property({ length: CIRCLE_MONEY_AMOUNT_STRING_LENGTH })
  amount: string

  @Enum(() => CircleAccountStatusEnum)
  status!: CircleAccountStatusEnum
}
