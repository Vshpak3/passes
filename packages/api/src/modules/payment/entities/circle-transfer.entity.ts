import { Entity, Enum, OneToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import {
  CIRCLE_CURRENCY_LENGTH,
  CIRCLE_ID_LENGTH,
  CIRCLE_IDEMPOTENCY_KEY_LENGTH,
  CIRCLE_MONEY_AMOUNT_STRING_LENGTH,
} from '../constants/schema'
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'
import { PayoutEntity } from './payout.entity'

@Entity({ tableName: 'circle_transfer' })
export class CircleTransferEntity extends BaseEntity {
  @OneToOne({ entity: () => PayoutEntity })
  payout_id: string

  @Property({ length: CIRCLE_IDEMPOTENCY_KEY_LENGTH })
  @Unique()
  idempotency_key: string | null

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circle_id: string | null

  @Property({ length: CIRCLE_MONEY_AMOUNT_STRING_LENGTH })
  amount: string

  @Property({ length: CIRCLE_CURRENCY_LENGTH })
  currency: string

  @Enum(() => CircleAccountStatusEnum)
  status!: CircleAccountStatusEnum
}
