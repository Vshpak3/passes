import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Length } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string

  @Length(1, 30)
  @ApiProperty()
  userName: string
}
