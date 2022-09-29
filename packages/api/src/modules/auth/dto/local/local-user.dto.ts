import { IsEmail, Matches } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { PASSWORD_VALIDATION_MSG } from '../../constants/errors'
import { PASSWORD_REGEX } from '../../constants/schema'

export class LocalUserDto {
  @IsEmail()
  @DtoProperty({ type: 'string', format: 'email', forceLower: true })
  email: string

  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MSG })
  @DtoProperty({ type: 'string', format: 'password' })
  password: string
}
