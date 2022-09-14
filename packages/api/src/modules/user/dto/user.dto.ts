import { IsEmail, IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_COUNTRY_CODE_LENGTH,
  USER_DISPLAY_NAME_LENGTH,
  USER_EMAIL_LENGTH,
  USER_LEGAL_FULL_NAME_LENGTH,
  USER_PHONE_NUMBER_LENGTH,
  USER_USERNAME_LENGTH,
} from '../constants/schema'

export class UserDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsEmail()
  @Length(1, USER_EMAIL_LENGTH)
  @DtoProperty({ forceLower: true })
  email: string

  @DtoProperty()
  isEmailVerified?: boolean

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ forceLower: true })
  username: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ optional: true })
  displayName?: string

  @DtoProperty({ optional: true })
  isCreator?: boolean

  // Sensitive fields (when viewing own profile)
  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
  @DtoProperty({ optional: true, forceLower: true })
  legalFullName?: string

  @Length(1, USER_PHONE_NUMBER_LENGTH)
  @DtoProperty({ optional: true })
  phoneNumber?: string

  // TODO: add validation, pretty sure this should be a Date
  @DtoProperty({ optional: true })
  birthday?: string

  @Length(1, USER_COUNTRY_CODE_LENGTH)
  @DtoProperty({ optional: true })
  countryCode?: string

  constructor(userEntity) {
    if (userEntity) {
      this.id = userEntity.id
      this.email = userEntity.email
      this.isEmailVerified = userEntity.is_email_verified
      this.username = userEntity.username
      this.displayName = userEntity.display_name
      this.isCreator = userEntity.is_creator
      this.legalFullName = userEntity.legal_full_name
      this.phoneNumber = userEntity.phone_number
      this.birthday = userEntity.birthday
      this.countryCode = userEntity.country_code
    }
  }

  override(init?: Partial<UserDto>): this {
    Object.assign(this, init)
    return this
  }
}
