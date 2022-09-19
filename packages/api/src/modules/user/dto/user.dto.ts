import {
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
  Length,
  Matches,
  Validate,
} from 'class-validator'

import { IsValidCountryCode } from '../../../validators/country-code.validator'
import { IsOnlyDate } from '../../../validators/date.validator'
import { IsNotBlocklistedUsername } from '../../../validators/username.validator'
import { DtoProperty } from '../../../web/dto.web'
import {
  USER_COUNTRY_CODE_LENGTH,
  USER_DISPLAY_NAME_LENGTH,
  USER_EMAIL_LENGTH,
  USER_LEGAL_FULL_NAME_LENGTH,
  USER_PHONE_NUMBER_LENGTH,
  USER_USERNAME_LENGTH,
} from '../constants/schema'
import { VALID_USERNAME_REGEX } from '../constants/username'

export class UserDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsEmail()
  @Length(1, USER_EMAIL_LENGTH)
  @DtoProperty({ forceLower: true })
  email: string

  @Length(1, USER_USERNAME_LENGTH)
  @Matches(VALID_USERNAME_REGEX, undefined, {
    message:
      'Username can only contain alphanumeric characters and underscores.',
  })
  @Validate(IsNotBlocklistedUsername)
  @DtoProperty({ forceLower: true })
  username: string

  // Sensitive fields (when viewing own profile)
  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
  @DtoProperty({ forceLower: true })
  legalFullName: string

  @Length(1, USER_COUNTRY_CODE_LENGTH)
  @Validate(IsValidCountryCode)
  @DtoProperty()
  countryCode: string

  @Validate(IsOnlyDate)
  @DtoProperty()
  birthday: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ optional: true })
  displayName?: string

  @IsBoolean()
  @DtoProperty({ optional: true })
  isCreator?: boolean

  @IsPhoneNumber()
  @Length(1, USER_PHONE_NUMBER_LENGTH)
  @DtoProperty({ optional: true })
  phoneNumber?: string

  constructor(userEntity) {
    if (userEntity) {
      this.id = userEntity.id
      this.email = userEntity.email
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
