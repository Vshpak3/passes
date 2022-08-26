import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  Length,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator'

import { IsValidCountryCode } from '../../../validators/CountryCodeValidator'
import { IsNotBlocklistedUsername } from '../../../validators/UsernameBlocklist'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_PHONE_NUMBER_LENGTH,
  USER_USERNAME_LENGTH,
} from '../constant/schema'
import { USERNAME_REGEX } from '../constants/validation'

export class CreateUserDto {
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

  @ApiProperty()
  @Validate(IsValidCountryCode)
  countryCode?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @ApiProperty()
  displayName?: string

  @IsDateString()
  @ApiPropertyOptional()
  birthday?: string

  @IsPhoneNumber()
  @MaxLength(USER_PHONE_NUMBER_LENGTH)
  @ApiPropertyOptional()
  phoneNumber?: string
}
