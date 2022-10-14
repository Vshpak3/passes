import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PostEntity } from '../../post/entities/post.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { COMMENT_TAGS_LENGTH, COMMENT_TEXT_LENGTH } from '../constants/schema'

@Entity()
export class CommentEntity extends BaseEntity {
  static table = 'comment'
  @ManyToOne({ entity: () => PostEntity })
  post_id: string

  @ManyToOne({ entity: () => UserEntity })
  commenter_id: string

  @Property({ length: COMMENT_TEXT_LENGTH })
  text: string

  @Property({ length: COMMENT_TAGS_LENGTH, default: '[]' })
  tags: string

  // Is Hidden by Post Owner (creator)
  @Property({ default: false })
  hidden: boolean

  @Property({ default: false })
  blocked: boolean

  @Property({ default: false })
  deactivated: boolean

  // Deleted by commenter
  @Property()
  deleted_at: Date | null
}
