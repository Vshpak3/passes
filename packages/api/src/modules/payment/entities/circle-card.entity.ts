import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'

@Entity({ tableName: 'circle_card' })
export class CircleCardEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property({ length: 255 })
  @Unique()
  idempotencyKey?: string

  @Property({ length: 255 })
  @Unique()
  circleCardId?: string

  @Enum(() => CircleAccountStatusEnum)
  status: CircleAccountStatusEnum

  @Property({ length: 255 })
  cardNumber: string

  @Property()
  expMonth: number

  @Property()
  expYear: number

  @Property({ length: 255 })
  name: string

  @Property()
  deletedAt?: Date
}
