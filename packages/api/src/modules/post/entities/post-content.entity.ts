import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ContentEntity } from '../../content/entities/content.entity'
import { PostEntity } from './post.entity'

@Entity({ tableName: 'post_content' })
@Unique({ properties: ['post', 'content'] })
export class PostContentEntity extends BaseEntity {
  @ManyToOne({ entity: () => PostEntity })
  post: PostEntity

  @ManyToOne({ entity: () => ContentEntity })
  content: ContentEntity
}
