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
  payout: PayoutEntity

  @Property({ length: CIRCLE_IDEMPOTENCY_KEY_LENGTH })
  @Unique()
  idempotencyKey?: string

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circleTransferId?: string

  @Property({ length: CIRCLE_MONEY_AMOUNT_STRING_LENGTH })
  amount: string

  @Property({ length: CIRCLE_CURRENCY_LENGTH })
  currency: string

  @Enum(() => CircleAccountStatusEnum)
  status!: CircleAccountStatusEnum
}
