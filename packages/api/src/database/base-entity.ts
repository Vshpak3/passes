import { OptionalProps, PrimaryKey, Property, UuidType } from '@mikro-orm/core'

export abstract class BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt'

  @PrimaryKey({ customType: new UuidType(), defaultRaw: 'gen_random_uuid()' })
  id!: string

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}
