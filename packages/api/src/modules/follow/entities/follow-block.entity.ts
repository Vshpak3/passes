import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

// Represents a creator restricting a follower
@Entity({ tableName: 'follow_block' })
@Unique({ properties: ['follower', 'creator'] })
export class FollowBlockEntity extends BaseEntity {
  @ManyToOne()
  follower: UserEntity

  @ManyToOne()
  creator: UserEntity
}
