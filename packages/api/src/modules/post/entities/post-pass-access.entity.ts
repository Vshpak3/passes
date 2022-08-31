import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PassEntity } from '../../pass/entities/pass.entity'
import { PostEntity } from './post.entity'

@Entity({ tableName: 'post_pass_access' })
@Unique({ properties: ['post', 'pass'] })
export class PostPassAccessEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @ManyToOne()
  pass: PassEntity
}
