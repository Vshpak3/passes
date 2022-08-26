import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Matches } from 'class-validator'

export class CreateLocalUserRequestDto {
  @IsEmail()
  @ApiProperty()
  email: string

  // Minimum eight characters, at least one letter and one number
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=\S+$).{8,}$/, {
    message:
      'Password must contain at least eight characters, one letter and one number',
  })
  @ApiProperty()
  password: string
}
