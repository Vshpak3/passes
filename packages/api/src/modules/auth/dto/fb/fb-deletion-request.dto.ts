import { MaxLength } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { AUTH_FACEBOOK_USER_ID_LENGTH } from '../../constants/schema'

export class FacebookDeletionRequestDto {
  @DtoProperty()
  @MaxLength(AUTH_FACEBOOK_USER_ID_LENGTH)
  user_id: string
}
