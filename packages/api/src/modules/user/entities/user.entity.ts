import { Entity, Index, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import {
  USER_COUNTRY_CODE_LENGTH,
  USER_DISPLAY_NAME_LENGTH,
  USER_EMAIL_LENGTH,
  USER_LEGAL_FULL_NAME_LENGTH,
  USER_OAUTH_ID_LENGTH,
  USER_OAUTH_PROVIDER_LENGTH,
  USER_PASSWORD_HASH_LENGTH,
  USER_PHONE_NUMBER_LENGTH,
  USER_USERNAME_LENGTH,
} from '../constants/schema'

@Entity({ tableName: 'users' }) // not a good idea to have a table named "user" in mysql
@Index({ properties: ['oauthId', 'oauthProvider'] })
export class UserEntity extends BaseEntity<
  'isKYCVerified' | 'isCreator' | 'isDisabled'
> {
  @Property({ length: USER_EMAIL_LENGTH })
  email: string

  @Property({ length: USER_PASSWORD_HASH_LENGTH })
  passwordHash?: string

  @Property({ length: USER_OAUTH_ID_LENGTH })
  oauthId?: string

  @Property({ length: USER_OAUTH_PROVIDER_LENGTH })
  oauthProvider?: string

  @Property({ length: USER_USERNAME_LENGTH })
  @Index()
  @Unique()
  username: string

  @Property({ length: USER_LEGAL_FULL_NAME_LENGTH })
  legalFullName?: string

  @Property({ length: USER_DISPLAY_NAME_LENGTH })
  @Index()
  displayName?: string

  @Property({ length: USER_PHONE_NUMBER_LENGTH })
  phoneNumber?: string

  @Property({ length: USER_COUNTRY_CODE_LENGTH })
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
