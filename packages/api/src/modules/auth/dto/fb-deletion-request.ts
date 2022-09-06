import { MaxLength } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
import { AUTH_FACEBOOK_USER_ID_LENGTH } from '../constant/schema'

export class FacebookDeletionRequestDto {
  @DtoProperty()
  @MaxLength(AUTH_FACEBOOK_USER_ID_LENGTH)
  user_id: string
}
