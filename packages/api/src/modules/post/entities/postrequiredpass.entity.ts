import { Entity, Index, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PassEntity } from '../../pass/entities/pass.entity'
import { PostEntity } from './post.entity'

@Entity({ tableName: 'post_required_pass' })
@Index({ properties: ['post', 'pass'] })
export class PostRequiredPassEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @ManyToOne()
  pass: PassEntity
}
