import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Length, Matches, Validate } from 'class-validator'

import { IsNotBlocklistedUsername } from '../../../validators/UsernameBlocklist'

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string

  @Length(1, 30)
  @ApiProperty()
  @Matches('[a-z0-9_]+')
  @Validate(IsNotBlocklistedUsername)
  userName: string
}
