import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { USER_USERNAME_LENGTH } from '../../user/constants/schema'
import { ProfileDto } from './profile.dto'

export class GetProfileResponseDto extends ProfileDto {}

export class GetProfileRequestDto {
  @DtoProperty({ type: 'uuid', optional: true })
  creatorId?: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  username?: string

  @DtoProperty({ type: 'uuid', optional: true })
  profileId?: string
}
