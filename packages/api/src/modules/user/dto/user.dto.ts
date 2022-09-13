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
  @DtoProperty()
  email: string

  @DtoProperty()
  isEmailVerified?: boolean

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty()
  username: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ required: false })
  displayName?: string

  @DtoProperty({ required: false })
  isCreator?: boolean

  // Sensitive fields (when viewing own profile)
  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
  @DtoProperty({ required: false })
  legalFullName?: string

  @Length(1, USER_PHONE_NUMBER_LENGTH)
  @DtoProperty({ required: false })
  phoneNumber?: string

  // TODO: add validation, pretty sure this should be a Date
  @DtoProperty({ required: false })
  birthday?: string

  @Length(1, USER_COUNTRY_CODE_LENGTH)
  @DtoProperty({ required: false })
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
