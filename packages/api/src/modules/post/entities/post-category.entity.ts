import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { POST_CATEGORY_NAME_LENGTH } from '../constants/schema'

@Entity()
@Unique({ properties: ['name', 'user_id'] })
export class PostCategoryEntity extends BaseEntity {
  static table = 'post_category'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ length: POST_CATEGORY_NAME_LENGTH })
  name: string

  @Property({ default: 0 })
  count: number

  @Property({ default: 0 })
  order: number
}
