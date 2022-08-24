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

  @Property({ length: 255 })
  @Unique()
  idempotencyKey?: string

  @Property({ length: 255 })
  @Unique()
  circlePayoutId?: string

  @Property({ length: 255 })
  fee?: string

  @Property({ length: 255 })
  amount: string

  @Enum(() => CircleAccountStatusEnum)
  status!: CircleAccountStatusEnum
}
