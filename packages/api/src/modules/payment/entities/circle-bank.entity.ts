import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'

@Entity({ tableName: 'circle_bank' })
export class CircleBankEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property()
  @Unique()
  circleBankId: string

  @Enum(() => CircleAccountStatusEnum)
  status: CircleAccountStatusEnum

  @Property()
  description: string

  @Property()
  trackingRef: string

  @Property()
  fingerprint: string
}
