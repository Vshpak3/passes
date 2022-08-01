import { OptionalProps, PrimaryKey, Property, UuidType } from '@mikro-orm/core'
import { v4 } from 'uuid'

export abstract class BaseEntity<O = void> {
  [OptionalProps]?: O | 'createdAt' | 'updatedAt'

  @PrimaryKey({ customType: new UuidType() })
  id = v4()

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}
