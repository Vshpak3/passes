import { IsEmail, Length } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: string

  @Length(1, 30)
  userName: string
}
