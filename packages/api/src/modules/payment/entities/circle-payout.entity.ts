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

@Entity()
export class CirclePayoutEntity extends BaseEntity {
  static table = 'circle_payout'

  @ManyToOne({ entity: () => CircleBankEntity })
  bank_id: string

  @OneToOne({ entity: () => PayoutEntity })
  payout_id: string

  @Property({ length: CIRCLE_IDEMPOTENCY_KEY_LENGTH })
  @Unique()
  idempotency_key: string | null

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circle_id: string | null

  @Property({ length: CIRCLE_MONEY_AMOUNT_STRING_LENGTH })
  fee: string | null

  @Property({ length: CIRCLE_MONEY_AMOUNT_STRING_LENGTH })
  amount: string

  @Enum(() => CircleAccountStatusEnum)
  status!: CircleAccountStatusEnum
}
