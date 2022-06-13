import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base/base-entity';

@Entity()
export class User extends BaseEntity {
  @Property()
  email!: string;

  @Property()
  isKYCVerified: boolean;

  @Property()
  userId: string;
}
