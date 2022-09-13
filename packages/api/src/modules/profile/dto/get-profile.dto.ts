import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { USER_USERNAME_LENGTH } from '../../user/constants/schema'
import { ProfileDto } from './profile.dto'

export class GetProfileResponseDto extends ProfileDto {}

export class GetProfileRequestDto {
  @IsUUID()
  @DtoProperty({ required: false })
  creatorId?: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ required: false })
  username?: string

  @IsUUID()
  @DtoProperty({ required: false })
  profileId?: string
}
