import { Entity, ManyToOne, OneToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PayinEntity } from '../../payment/entities/payin.entity'
import { UserEntity } from '../../user/entities/user.entity'
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
}
