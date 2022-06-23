import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'user' })
export class UserEntity extends BaseEntity {
  @Property()
  email: string

  @Property({ length: 30 })
  userName: string

  @Property({ length: 50 })
  fullName?: string

  @Property()
  phoneNumber?: string

  @Property({ type: 'date' })
  birthday?: string

  @Property()
  isKYCVerified: boolean = false

  @Property()
  isCreator: boolean = false
}
