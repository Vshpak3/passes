import { IsEmail, Matches } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { PASSWORD_VALIDATION_MSG } from '../../constants/errors'
import { PASSWORD_REGEX } from '../../constants/schema'

export class CreateLocalUserRequestDto {
  @IsEmail()
  @DtoProperty({ forceLower: true })
  email: string

  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MSG })
  @DtoProperty()
  password: string
}
