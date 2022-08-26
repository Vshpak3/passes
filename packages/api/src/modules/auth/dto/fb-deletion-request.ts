import { ApiProperty } from '@nestjs/swagger'
import { MaxLength } from 'class-validator'

import { AUTH_FACEBOOK_USER_ID_LENGTH } from '../constant/schema'

export class FacebookDeletionRequestDto {
  @ApiProperty()
  @MaxLength(AUTH_FACEBOOK_USER_ID_LENGTH)
  user_id: string
}
