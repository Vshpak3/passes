import { IsEmail, Matches } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class CreateLocalUserRequestDto {
  @IsEmail()
  @DtoProperty()
  email: string

  // Minimum eight characters, at least one letter and one number
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=\S+$).{8,}$/, {
    message:
      'Password must contain at least eight characters, one letter and one number',
  })
  @DtoProperty()
  password: string
}
