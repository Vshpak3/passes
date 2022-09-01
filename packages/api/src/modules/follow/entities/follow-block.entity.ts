import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

// Represents a creator restricting a follower
@Entity({ tableName: 'follow_block' })
export class FollowBlockEntity extends BaseEntity {
  @ManyToOne()
  subscriber: UserEntity

  @ManyToOne()
  creator: UserEntity

  @Property({ length: 255 })
  reason: string
}
