import { IsEmail, IsString } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'

export class LocalUserLoginRequestDto {
  @IsEmail()
  @DtoProperty({ forceLower: true })
  email: string

  @IsString()
  @DtoProperty()
  password: string
}
