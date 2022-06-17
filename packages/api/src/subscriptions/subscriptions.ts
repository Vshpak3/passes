import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../base/base-entity'

@Entity()
export class Subscriptions extends BaseEntity {
  @Property()
  userId: string;

  @Property()
  subscribedAt: Date = new Date();

  @Property()
  numPostsLiked: number;

  @Property()
  numComments: number;

  @Property()
  amountSpent: Float64Array;

  @Property()
  numTotalLikes: number;

  @Property()
  numShared: number;
}
