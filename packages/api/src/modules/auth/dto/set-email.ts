import { IsEmail } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class SetEmailRequestDto {
  @IsEmail()
  @DtoProperty()
  email: string
}
