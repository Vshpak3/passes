import { Entity, Index, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity()
@Index({ properties: ['created_at'] })
export class BlockTaskEntity extends BaseEntity {
  static table = 'block_task'
  @ManyToOne({ entity: () => UserEntity })
  follower_id: string

  @ManyToOne({ entity: () => UserEntity })
  creator_id: string
}
