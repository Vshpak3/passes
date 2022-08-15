import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PostEntity } from '../../post/entities/post.entity'
import { ContentEntity } from './content.entity'

@Entity({ tableName: 'content_post' })
@Unique({ properties: ['content', 'post'] })
export class ContentPostEntity extends BaseEntity {
  @ManyToOne()
  content: ContentEntity

  @ManyToOne()
  post: PostEntity
}
