import { OptionalProps, PrimaryKey, Property, UuidType } from '@mikro-orm/core'
import { v4 } from 'uuid'

export abstract class BaseEntity<O = void> {
  [OptionalProps]?: O | 'createdAt' | 'updatedAt'

  @PrimaryKey({ customType: new UuidType() })
  id = v4()

  @Property({ defaultRaw: 'NOW()' })
  createdAt: Date

  @Property({ defaultRaw: 'NOW()', extra: 'on update now()' })
  updatedAt: Date
}
