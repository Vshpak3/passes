import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
  types,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ContentEntity } from '../../content/entities/content.entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { POST_CONTENT_LENGTH } from '../constants/schema'

@Entity({ tableName: 'post' })
export class PostEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @ManyToMany(() => ContentEntity, (content) => content.post)
  content = new Collection<ContentEntity>(this)

  @Property({ length: POST_CONTENT_LENGTH })
  text: string

  @Property({ default: 0 })
  numLikes: number

  @Property({ default: 0 })
  numComments: number

  @Property()
  deletedAt?: Date

  @Property()
  private: boolean

  @Property({ columnType: USD_AMOUNT_TYPE })
  price?: number

  @Property({ type: types.bigint })
  expiresAt?: number

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  totalTipAmount: number

  @Property()
  scheduledAt?: Date
}
