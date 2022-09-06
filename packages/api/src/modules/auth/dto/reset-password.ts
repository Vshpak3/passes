import { IsEmail } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class ResetPasswordRequestDto {
  @IsEmail()
  @DtoProperty()
  email: string
}
