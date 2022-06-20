import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity()
export class Subscription extends BaseEntity {
  @Property()
  userId: string

  @Property()
  subscribedAt: Date = new Date()

  @Property()
  numPostsLiked: number

  @Property()
  numComments: number

  @Property()
  amountSpent: Float64Array

  @Property()
  numTotalLikes: number

  @Property()
  numShared: number
}
