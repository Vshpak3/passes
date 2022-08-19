import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  Length,
  Matches,
  Validate,
} from 'class-validator'

import { IsValidCountryCode } from '../../../validators/CountryCodeValidator'
import { IsNotBlocklistedUsername } from '../../../validators/UsernameBlocklist'
import { USERNAME_REGEX } from '../constants/validation'

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string

  @Length(1, 30)
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

  @Length(1, 50)
  @ApiProperty()
  displayName?: string

  @IsDateString()
  @ApiPropertyOptional()
  birthday?: string

  @IsPhoneNumber()
  @ApiPropertyOptional()
  phoneNumber?: string
}
