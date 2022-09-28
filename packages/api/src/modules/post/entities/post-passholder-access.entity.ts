import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PassHolderEntity } from '../../pass/entities/pass-holder.entity'
import { PostUserAccessEntity } from './post-user-access.entity'

@Entity({ tableName: 'post_pass_holder_access' })
@Unique({ properties: ['post_user_access_id', 'pass_holder_id'] })
export class PostPassHolderAccessEntity extends BaseEntity {
  @ManyToOne({ entity: () => PostUserAccessEntity })
  post_user_access_id: string

  @ManyToOne({ entity: () => PassHolderEntity })
  pass_holder_id: string
}
