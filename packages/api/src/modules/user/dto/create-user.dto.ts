import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Length, Matches, Validate } from 'class-validator'

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
}
