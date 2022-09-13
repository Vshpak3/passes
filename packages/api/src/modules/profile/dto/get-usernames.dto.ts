import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { USER_USERNAME_LENGTH } from '../../user/constants/schema'

export class GetUsernamesResponseDto {
  @Length(1, USER_USERNAME_LENGTH, { each: true })
  @DtoProperty()
  usernames: string[]
}
