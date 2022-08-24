import { Entity, Index, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'users' }) // not a good idea to have a table named "user" in postgres
@Index({ properties: ['oauthId', 'oauthProvider'] })
export class UserEntity extends BaseEntity<
  'isKYCVerified' | 'isCreator' | 'isDisabled'
> {
  @Property({ length: 255 })
  email: string

  @Property({ length: 255 })
  passwordHash?: string

  @Property({ length: 255 })
  oauthId?: string

  @Property({ length: 255 })
  oauthProvider?: string

  @Property({ length: 30 })
  @Index()
  @Unique()
  username: string

  @Property({ length: 50 })
  legalFullName?: string

  @Property({ length: 50 })
  @Index()
  displayName?: string

  @Property({ length: 255 })
  phoneNumber?: string

  @Property({ length: 255 })
  countryCode?: string

  @Property({ type: 'date' })
  birthday?: string

  @Property({ default: false })
  isKYCVerified = false

  @Property({ default: false })
  isCreator = false

  @Property({ default: false })
  isDisabled = false
}
