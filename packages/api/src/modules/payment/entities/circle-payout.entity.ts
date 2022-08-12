import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'
import { CircleBankEntity } from './circle-bank.entity'
import { PayoutEntity } from './payout.entity'

@Entity({ tableName: 'circle_payout' })
export class CirclePayoutEntity extends BaseEntity {
  @ManyToOne({ entity: () => CircleBankEntity })
  bank: CircleBankEntity

  @OneToOne({ entity: () => PayoutEntity })
  payout: PayoutEntity

  @Property()
  @Unique()
  idempotencyKey?: string

  @Property()
  @Unique()
  circlePayoutId?: string

  @Property()
  fee?: string

  @Property()
  amount: string

  @Enum(() => CircleAccountStatusEnum)
  status!: CircleAccountStatusEnum
}
