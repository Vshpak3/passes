import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { FAN_COMMENT_TEXT_LENGTH } from '../constants/schema'

@Entity({ tableName: 'fan_wall_comment' })
@Index({ properties: ['createdAt'] })
export class FanWallCommentEntity extends BaseEntity {
  @ManyToOne()
  creator: UserEntity

  @ManyToOne()
  commenter: UserEntity

  @Property({ length: FAN_COMMENT_TEXT_LENGTH })
  text: string

  // Is Hidden by Post Owner (creator)
  @Property()
  hiddenAt?: Date

  // Deleted by commenter
  @Property()
  deletedAt?: Date
}
