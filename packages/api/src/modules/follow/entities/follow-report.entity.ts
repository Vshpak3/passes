import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { REASON_FOR_BLOCKING_LENGTH } from '../constants/schema'

// Represents a creator reporting a follower
@Entity()
@Index({ properties: ['created_at'] })
export class ReportEntity extends BaseEntity {
  static table = 'report'

  @ManyToOne({ entity: () => UserEntity })
  reporter_id: string

  @ManyToOne({ entity: () => UserEntity })
  reportee_id: string

  @Property({ length: REASON_FOR_BLOCKING_LENGTH })
  reason: string
}
