import { IsEmail, Length, Matches, Validate } from 'class-validator'

import { IsValidCountryCode } from '../../../validators/country-code.validator'
import { IsOnlyDate } from '../../../validators/date.validator'
import { IsNotBlocklistedUsername } from '../../../validators/username.validator'
import { DtoProperty } from '../../../web/dto.web'
import {
  USER_COUNTRY_CODE_LENGTH,
  USER_DISPLAY_NAME_LENGTH,
  USER_LEGAL_FULL_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../constants/schema'
import { USERNAME_REGEX } from '../constants/validation'

export class CreateUserDto {
  @IsEmail()
  @DtoProperty()
  email: string

  @Length(1, USER_USERNAME_LENGTH)
  @Matches(USERNAME_REGEX, undefined, {
    message:
      'Username can only contain alphanumeric characters and underscores.',
  })
  @Validate(IsNotBlocklistedUsername)
  @DtoProperty()
  username: string

  @Length(1, USER_LEGAL_FULL_NAME_LENGTH)
  @DtoProperty()
  legalFullName: string

  @Length(1, USER_COUNTRY_CODE_LENGTH)
  @Validate(IsValidCountryCode)
  @DtoProperty()
  countryCode: string

  //TODO: shouldn't this be a date object (?)
  @Validate(IsOnlyDate)
  @DtoProperty()
  birthday: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty()
  displayName: string

  // @IsPhoneNumber()
  // @MaxLength(USER_PHONE_NUMBER_LENGTH)
  // @DtoProperty()
  // phoneNumber: string
}
