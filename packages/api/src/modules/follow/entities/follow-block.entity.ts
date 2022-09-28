import { Entity, Index, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

// Represents a creator restricting a follower
@Entity({ tableName: 'follow_block' })
@Unique({ properties: ['follower_id', 'creator_id'] })
@Index({ properties: ['created_at'] })
export class FollowBlockEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  follower_id: string

  @ManyToOne({ entity: () => UserEntity })
  creator_id: string
}
