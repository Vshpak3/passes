import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { REASON_FOR_BLOCKING_LENGTH } from '../constants/schema'

// Represents a creator reporting a follower
@Entity({ tableName: 'follow_report' })
@Index({ properties: ['created_at'] })
export class FollowReportEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  follower_id: string

  @ManyToOne({ entity: () => UserEntity })
  creator_id: string

  @Property({ length: REASON_FOR_BLOCKING_LENGTH })
  reason: string
}
