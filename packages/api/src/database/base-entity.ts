import { PrimaryKey, Property, UuidType } from '@mikro-orm/core'

export abstract class BaseEntity {
  static table: string

  @PrimaryKey({
    type: new UuidType(),
    defaultRaw: '(UUID())',
  })
  id: string

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP(3)', length: 3 })
  created_at: Date

  @Property({
    defaultRaw: 'CURRENT_TIMESTAMP(3)',
    extra: 'on update CURRENT_TIMESTAMP(3)',
    length: 3,
  })
  updated_at: Date
}
