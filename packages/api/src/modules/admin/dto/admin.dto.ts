import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { USER_USERNAME_LENGTH } from '../../user/constants/schema'
import { ADMIN_SECRET_LENGTH } from '../constants/schema'

export class AdminDto {
  @DtoProperty({ type: 'uuid', optional: true })
  userId?: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true, forceLower: true })
  username?: string

  @Length(1, ADMIN_SECRET_LENGTH)
  @DtoProperty({ type: 'string' })
  secret: string
}
