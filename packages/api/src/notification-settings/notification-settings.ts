import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base/base-entity';

@Entity()
export class NotificationSettings extends BaseEntity {

  @Property()
  userId: string;
}