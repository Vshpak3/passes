import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';

@Entity()
export class Post extends BaseEntity {

  @Property()
  numLikes: number;

  @Property()
  numComments: number;

  @Property()
  isLocked: boolean;

  @Property()
  numEarned: Float64Array;

  @Property()
  numShared: number;

  @Property()
  isFeatured: boolean;

  @Property()
  content: string;

  @Property()
  userId: number;
}