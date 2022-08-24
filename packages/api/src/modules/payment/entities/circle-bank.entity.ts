import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'

@Entity({ tableName: 'circle_bank' })
export class CircleBankEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property({ length: 255 })
  @Unique()
  idempotencyKey?: string

  @Property({ length: 255 })
  @Unique()
  circleBankId?: string

  @Enum(() => CircleAccountStatusEnum)
  status: CircleAccountStatusEnum

  @Property({ length: 255 })
  description: string

  @Property({ length: 255 })
  trackingRef: string

  @Property({ length: 255 })
  fingerprint: string

  @Property()
  deletedAt?: Date
}
