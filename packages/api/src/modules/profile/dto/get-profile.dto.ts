import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { USER_USERNAME_LENGTH } from '../../user/constants/schema'
import { ProfileDto } from './profile.dto'

export class GetProfileResponseDto extends ProfileDto {}

export class GetProfileRequestDto {
  @IsUUID()
  @DtoProperty({ optional: true })
  creatorId?: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ optional: true })
  username?: string

  @IsUUID()
  @DtoProperty({ optional: true })
  profileId?: string
}
