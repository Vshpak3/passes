import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { USER_USERNAME_LENGTH } from '../../user/constants/schema'

export class AdminDto {
  @IsUUID()
  @DtoProperty({ optional: true })
  userId?: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ optional: true, forceLower: true })
  username?: string

  //TODO: length validation ?
  @DtoProperty()
  secret: string
}
