import { Entity, Index, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'users' }) // not a good idea to have a table named "user" in postgres
@Index({ properties: ['oauthId', 'oauthProvider'] })
export class UserEntity extends BaseEntity<
  'isKYCVerified' | 'isCreator' | 'isDisabled'
> {
  @Property()
  email: string

  @Property()
  passwordHash?: string

  @Property()
  oauthId?: string

  @Property()
  oauthProvider?: string

  @Property({ length: 30 })
  @Index()
  @Unique()
  userName: string

  @Property({ length: 50 })
  legalFullName?: string

  @Property({ length: 50 })
  @Index()
  displayName?: string

  @Property()
  phoneNumber?: string

  @Property({ type: 'date' })
  birthday?: string

  @Property()
  isKYCVerified = false

  @Property()
  isCreator = false

  @Property()
  isDisabled = false
}
