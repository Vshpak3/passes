import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'

@Entity({ tableName: 'circle_card' })
export class CircleCardEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property()
  @Unique()
  circleCardId: string

  @Enum(() => CircleAccountStatusEnum)
  status: CircleAccountStatusEnum

  @Property()
  fourDigits: string

  @Property()
  expMonth: number

  @Property()
  expYear: number

  @Property()
  name: string

  @Property()
  active = true
}
