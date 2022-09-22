import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PassHolderEntity } from '../../pass/entities/pass-holder.entity'
import { PostUserAccessEntity } from './post-user-access.entity'

@Entity({ tableName: 'post_pass_holder_access' })
@Unique({ properties: ['postUserAccess', 'passHolder'] })
export class PostPassHolderAccessEntity extends BaseEntity {
  @ManyToOne()
  postUserAccess: PostUserAccessEntity

  @ManyToOne()
  passHolder: PassHolderEntity
}
