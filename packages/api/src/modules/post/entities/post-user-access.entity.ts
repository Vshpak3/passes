import { Entity, ManyToOne, OneToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PayinEntity } from '../../payment/entities/payin.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PASSHOLDER_IDS_LENGTH } from '../constants/schema'
import { PostEntity } from './post.entity'

@Entity({ tableName: 'post_user_access' })
@Unique({ properties: ['post', 'user'] })
export class PostUserAccessEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @ManyToOne()
  user: UserEntity

  @Property({ length: PASSHOLDER_IDS_LENGTH })
  passHolderIds?: string

  @OneToOne()
  payin?: PayinEntity
}
