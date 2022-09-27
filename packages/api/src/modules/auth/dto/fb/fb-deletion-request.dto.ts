import { MaxLength } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { AUTH_FACEBOOK_USER_ID_LENGTH } from '../../constants/schema'

export class FacebookDeletionRequestDto {
  @MaxLength(AUTH_FACEBOOK_USER_ID_LENGTH)
  @DtoProperty({ type: 'string' })
  user_id: string
}
