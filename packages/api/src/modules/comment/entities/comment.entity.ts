import { Entity, Property, ManyToOne } from '@mikro-orm/core'
import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PostEntity } from '../../post/entities/post.entity'

@Entity({ tableName: 'comment' })
export class CommentEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @ManyToOne()
  commenter: UserEntity

  @Property({ length: 150 })
  content: string
}
