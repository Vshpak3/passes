import { Matches } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { PASSWORD_VALIDATION_MSG } from '../../constants/errors'
import { PASSWORD_REGEX } from '../../constants/schema'

export class UpdatePasswordRequestDto {
  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MSG })
  @DtoProperty({ type: 'string' })
  oldPassword: string

  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MSG })
  @DtoProperty({ type: 'string' })
  newPassword: string
}
