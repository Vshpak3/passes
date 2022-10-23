import { Entity, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ContentEntity } from '../../content/entities/content.entity'
import { PostEntity } from './post.entity'

@Entity()
export class PostContentEntity extends BaseEntity {
  static table = 'post_content'

  @ManyToOne({ entity: () => PostEntity })
  post_id: string

  @ManyToOne({ entity: () => ContentEntity })
  content_id: string
}
