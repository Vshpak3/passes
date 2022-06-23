import { Entity, Property, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'subscription' })
export class SubscriptionEntity extends BaseEntity {
  @ManyToOne()
  subscriber: UserEntity

  @ManyToOne()
  creator: UserEntity

  @Property()
  isActive: boolean = true
}
