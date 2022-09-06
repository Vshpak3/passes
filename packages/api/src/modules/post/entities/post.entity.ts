import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { POST_TEXT_LENGTH } from '../constants/schema'

@Entity({ tableName: 'post' })
export class PostEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ length: POST_TEXT_LENGTH })
  text: string

  @Index()
  @Property({ default: 0 })
  numLikes: number

  @Index()
  @Property({ default: 0 })
  numComments: number

  @Index()
  @Property({ default: 0 })
  numPurchases: number

  @Property()
  deletedAt?: Date

  @Property()
  isMessage: boolean

  @Property({ columnType: USD_AMOUNT_TYPE })
  price?: number

  @Index()
  @Property()
  expiresAt?: Date

  @Property()
  pinnedAt?: Date

  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  totalTipAmount: number

  @Index()
  @Property()
  scheduledAt?: Date
}
