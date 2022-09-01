import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

// Represents a creator restricting a follower
@Unique({ properties: ['subscriber', 'creator'] })
@Entity({ tableName: 'follow_restrict' })
export class FollowRestrictEntity extends BaseEntity {
  @ManyToOne()
  subscriber: UserEntity

  @ManyToOne()
  creator: UserEntity
}
