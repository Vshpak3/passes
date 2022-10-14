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

export class UserIndexes {
  id?: string = undefined
  username?: string = undefined
  email?: string = undefined
  display_name?: string = undefined
}

@Entity({ tableName: 'users' }) // pural because it not a good idea to have a table named "user" in mysql
export class UserEntity extends BaseEntity {
  static table = 'users'
  @Property({ length: USER_EMAIL_LENGTH })
  @Unique()
  email: string

  @Property({ length: USER_USERNAME_LENGTH })
  @Unique()
  username: string

  @Property({ length: USER_LEGAL_FULL_NAME_LENGTH })
  legal_full_name: string

  @Property({ length: USER_COUNTRY_CODE_LENGTH })
  country_code: string

  @Property({ type: new DateType() })
  birthday: string

  @Property({ length: USER_DISPLAY_NAME_LENGTH })
  @Index()
  display_name: string | null

  @Property({ length: USER_PHONE_NUMBER_LENGTH })
  phone_number: string | null

  @Property({ default: false })
  is_kyc_verified = false

  @Property({ default: false })
  is_creator = false

  @Property({ default: true })
  is_active = true

  @Property({ default: false })
  is_adult = false

  @Property({ default: 0 })
  num_following: number

  @Property({ default: false })
  payment_blocked: boolean

  @Property({ default: 0 })
  chargeback_count: number
}
