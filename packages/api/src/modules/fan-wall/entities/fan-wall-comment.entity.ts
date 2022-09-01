import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { FAN_COMMENT_CONTENT_LENGTH } from '../constants/schema'

@Entity({ tableName: 'fan_wall_comment' })
export class FanWallCommentEntity extends BaseEntity {
  @ManyToOne()
  creator: UserEntity

  @ManyToOne()
  commenter: UserEntity

  @Property({ length: FAN_COMMENT_CONTENT_LENGTH })
  content: string

  // Is Hidden by Post Owner (creator)
  @Property({ default: false })
  isHidden = false

  // Deleted by commenter
  @Property()
  deletedAt?: Date
}
