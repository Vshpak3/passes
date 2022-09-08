import { IsEmail, Length, Matches, Validate } from 'class-validator'

import { IsValidCountryCode } from '../../../validators/CountryCodeValidator'
import { IsNotBlocklistedUsername } from '../../../validators/UsernameBlocklist'
import { DtoProperty } from '../../../web/dto.web'
import { USER_USERNAME_LENGTH } from '../constants/schema'
import { USERNAME_REGEX } from '../constants/validation'

export class CreateUserRequestDto {
  @IsEmail()
  @DtoProperty()
  email: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty()
  @Matches(USERNAME_REGEX, undefined, {
    message:
      'Username can only contain alphanumeric characters, and underscores.',
  })
  @Validate(IsNotBlocklistedUsername)
  username: string

  // TODO: add validation
  @DtoProperty()
  legalFullName: string

  @DtoProperty()
  @Validate(IsValidCountryCode)
  countryCode: string

  // @IsDate() TODO: fix this validation
  @DtoProperty()
  birthday: string

  // @Length(1, USER_DISPLAY_NAME_LENGTH)
  // @DtoProperty()
  // displayName?: string

  // @IsPhoneNumber()
  // @MaxLength(USER_PHONE_NUMBER_LENGTH)
  // @DtoProperty({ required: false })
  // phoneNumber?: string
}
