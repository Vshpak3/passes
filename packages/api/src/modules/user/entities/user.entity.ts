import { Entity, Index, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'users' }) // not a good idea to have a table named "user" in postgres
export class UserEntity extends BaseEntity {
  @Property()
  email: string

  @Property()
  @Index()
  oauthId?: string

  @Property()
  oauthProvider?: string

  @Property({ length: 30 })
  userName: string

  @Property({ length: 50 })
  fullName?: string

  @Property()
  phoneNumber?: string

  @Property({ type: 'date' })
  birthday?: string

  @Property()
  isKYCVerified?: boolean = false

  @Property()
  isCreator?: boolean = false

  @Property()
  isDisabled?: boolean = false
}
