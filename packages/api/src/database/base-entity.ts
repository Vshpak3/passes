import { PrimaryKey, Property, UuidType } from '@mikro-orm/core'

export abstract class BaseEntity {
  static table: string

  @PrimaryKey({
    type: new UuidType(),
    defaultRaw: '(UUID())',
  })
  id: string

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Property({
    defaultRaw: 'CURRENT_TIMESTAMP',
    extra: 'on update CURRENT_TIMESTAMP',
  })
  updated_at: Date
}
