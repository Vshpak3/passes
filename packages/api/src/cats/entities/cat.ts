import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../app/entities/base-entity';

@Entity()
export class Cat extends BaseEntity {
  @Property()
  name!: string;
}
