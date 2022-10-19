import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import {
  FAN_COMMENT_TAGS_LENGTH,
  FAN_COMMENT_TEXT_LENGTH,
} from '../constants/schema'

@Entity()
@Index({ properties: ['created_at'] })
export class FanWallCommentEntity extends BaseEntity {
  static table = 'fan_wall_comment'

  @ManyToOne({ entity: () => UserEntity })
  creator_id: string

  @ManyToOne({ entity: () => UserEntity })
  commenter_id: string

  @Property({ length: FAN_COMMENT_TEXT_LENGTH })
  text: string

  @Property({ length: FAN_COMMENT_TAGS_LENGTH, default: '[]' })
  tags: string

  // Is Hidden by Post Owner (creator)
  @Property({ default: false })
  hidden: boolean

  @Property({ default: false })
  blocked: boolean

  @Property({ default: false })
  deactivated: boolean

  // Deleted by commenter
  @Property({ length: 3 })
  deleted_at: Date | null
}
