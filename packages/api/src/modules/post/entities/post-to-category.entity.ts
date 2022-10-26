import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PostEntity } from './post.entity'
import { PostCategoryEntity } from './post-category.entity'

@Entity()
@Unique({ properties: ['post_category_id', 'post_id'] })
export class PostToCategoryEntity extends BaseEntity {
  static table = 'post_to_category'

  @ManyToOne({ entity: () => PostCategoryEntity })
  post_category_id: string

  @ManyToOne({ entity: () => PostEntity })
  post_id: string
}
