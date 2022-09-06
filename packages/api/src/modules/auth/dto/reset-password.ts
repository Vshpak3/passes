import { IsEmail } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class ResetPasswordRequestDto {
  @IsEmail()
  @DtoProperty()
  email: string
}
