import { Entity, Index, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'block_task' })
@Index({ properties: ['createdAt'] })
export class BlockTaskEntity extends BaseEntity {
  @ManyToOne()
  follower: UserEntity

  @ManyToOne()
  creator: UserEntity
}
