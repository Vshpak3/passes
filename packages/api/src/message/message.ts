import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';

@Entity()
export class Message extends BaseEntity {
  @Property()
  userId: number;

  @Property()
  sentAt: Date = new Date();

  @Property()
  message: string;

  @Property()
  walletAddress: string;

  @Property()
  senderId: number;

  @Property()
  receiverId: number;

}