import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsEmail,
  Length,
  Matches,
  Validate,
} from 'class-validator'

import { IsValidCountryCode } from '../../../validators/CountryCodeValidator'
import { IsNotBlocklistedUsername } from '../../../validators/UsernameBlocklist'
import { USER_USERNAME_LENGTH } from '../constants/schema'
import { USERNAME_REGEX } from '../constants/validation'

export class CreateUserRequestDto {
  @IsEmail()
  @ApiProperty()
  email: string

  @Length(1, USER_USERNAME_LENGTH)
  @ApiProperty()
  @Matches(USERNAME_REGEX, undefined, {
    message:
      'Username can only contain alphanumeric characters, and underscores.',
  })
  @Validate(IsNotBlocklistedUsername)
  username: string

  // TODO: add validation
  @ApiProperty()
  legalFullName: string

  @ApiProperty()
  @Validate(IsValidCountryCode)
  countryCode: string

  @IsDateString()
  @ApiProperty()
  birthday: string

  // @Length(1, USER_DISPLAY_NAME_LENGTH)
  // @ApiProperty()
  // displayName?: string

  // @IsPhoneNumber()
  // @MaxLength(USER_PHONE_NUMBER_LENGTH)
  // @ApiPropertyOptional()
  // phoneNumber?: string
}
