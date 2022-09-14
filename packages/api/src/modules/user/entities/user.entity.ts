import { Entity, Index, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { DateType } from '../../../database/database.types'
import {
  USER_COUNTRY_CODE_LENGTH,
  USER_DISPLAY_NAME_LENGTH,
  USER_EMAIL_LENGTH,
  USER_LEGAL_FULL_NAME_LENGTH,
  USER_PHONE_NUMBER_LENGTH,
  USER_USERNAME_LENGTH,
} from '../constants/schema'

@Entity({ tableName: 'users' }) // pural because it not a good idea to have a table named "user" in mysql
export class UserEntity extends BaseEntity<
  'isKYCVerified' | 'isCreator' | 'isDisabled'
> {
  @Property({ length: USER_EMAIL_LENGTH })
  @Unique()
  email: string

  @Property({ length: USER_USERNAME_LENGTH })
  @Unique()
  username: string

  @Property({ length: USER_LEGAL_FULL_NAME_LENGTH })
  legalFullName: string

  @Property({ length: USER_COUNTRY_CODE_LENGTH })
  countryCode: string

  @Property({ type: new DateType() })
  birthday: string

  @Property({ length: USER_DISPLAY_NAME_LENGTH })
  @Index()
  displayName?: string

  @Property({ length: USER_PHONE_NUMBER_LENGTH })
  phoneNumber?: string

  @Property({ default: false })
  isKYCVerified = false

  @Property({ default: false })
  isCreator = false

  @Property({ default: true })
  isActive = true

  @Property({ default: false })
  isAdult = false

  @Property({ default: 0 })
  numFollowing: number
}
