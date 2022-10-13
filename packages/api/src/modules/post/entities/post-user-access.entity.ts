import { Entity, ManyToOne, OneToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PayinEntity } from '../../payment/entities/payin.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PASS_HOLDER_IDS_LENGTH } from '../constants/schema'
import { PostEntity } from './post.entity'

@Entity({ tableName: 'post_user_access' })
@Unique({ properties: ['post_id', 'user_id'] })
export class PostUserAccessEntity extends BaseEntity {
  @ManyToOne({ entity: () => PostEntity })
  post_id: string

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @OneToOne({ entity: () => PayinEntity })
  payin_id: string | null

  @Property({ length: PASS_HOLDER_IDS_LENGTH })
  pass_holder_ids: string
}
