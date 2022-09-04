import { Entity, Index, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

// Represents a user following a creator
@Entity({ tableName: 'follow' })
@Unique({ properties: ['follower', 'creator'] })
@Index({ properties: ['createdAt'] })
export class FollowEntity extends BaseEntity {
  @ManyToOne()
  follower: UserEntity

  @ManyToOne()
  creator: UserEntity
}
