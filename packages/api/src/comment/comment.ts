import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';

@Entity()
export class Comment extends BaseEntity {

  @Property()
  comment: string;

  @Property()
  postId: number;

  @Property()
  senderId: number;

  @Property()
  receiverId: number;

  @Property()
  dateCommented: Date = new Date();


}