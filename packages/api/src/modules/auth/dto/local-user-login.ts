import { IsEmail, IsString } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class LocalUserLoginRequestDto {
  @IsEmail()
  @DtoProperty()
  email: string

  @IsString()
  @DtoProperty()
  password: string
}
