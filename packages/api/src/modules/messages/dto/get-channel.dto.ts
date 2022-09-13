import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { USER_USERNAME_LENGTH } from '../../user/constants/schema'
import { CHANNEL_ID_LENGTH } from '../constants/schema'

export class GetChannelRequestDto {
  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty()
  username: string

  @IsUUID()
  @DtoProperty({ required: false })
  userId?: string
}

export class GetChannelResponseDto {
  @Length(1, CHANNEL_ID_LENGTH)
  @DtoProperty()
  channelId: string

  @DtoProperty()
  blocked: boolean
}
