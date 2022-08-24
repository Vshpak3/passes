import { Entity, Enum, OneToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'
import { PayoutEntity } from './payout.entity'

@Entity({ tableName: 'circle_transfer' })
export class CircleTransferEntity extends BaseEntity {
  @OneToOne({ entity: () => PayoutEntity })
  payout: PayoutEntity

  @Property({ length: 255 })
  @Unique()
  idempotencyKey?: string

  @Property({ length: 255 })
  @Unique()
  circleTransferId?: string

  @Property({ length: 255 })
  amount: string

  @Property({ length: 255 })
  currency: string

  @Enum(() => CircleAccountStatusEnum)
  status!: CircleAccountStatusEnum
}
