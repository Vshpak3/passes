import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base/base-entity';

@Entity()
export class Subscriptions extends BaseEntity {

  @Property()
  userId: string;
}