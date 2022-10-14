import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PassEntity } from '../../pass/entities/pass.entity'
import { PostEntity } from './post.entity'

@Entity()
@Unique({ properties: ['post_id', 'pass_id'] })
export class PostPassAccessEntity extends BaseEntity {
  static table = 'post_pass_access'

  @ManyToOne({ entity: () => PostEntity })
  post_id: string

  @ManyToOne({ entity: () => PassEntity })
  pass_id: string
}
