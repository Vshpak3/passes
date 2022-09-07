import { Matches } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PASSWORD_VALIDATION_MSG } from '../constant/errors'
import { PASSWORD_REGEX } from '../constant/schema'

export class UpdatePasswordRequestDto {
  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MSG })
  @DtoProperty()
  oldPassword: string

  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MSG })
  @DtoProperty()
  newPassword: string
}
