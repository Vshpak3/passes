import { PrimaryKey, Property, UuidType } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey({ customType: new UuidType(), defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
