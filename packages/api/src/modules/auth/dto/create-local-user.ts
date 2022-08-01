import { IsEmail, Matches } from 'class-validator'

export class CreateLocalUserDto {
  @IsEmail()
  email: string

  // Minimum eight characters, at least one letter and one number
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must contain at least eight characters, one letter and one number',
  })
  password: string
}
