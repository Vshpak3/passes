import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  EXTERNAL_URL_LENGTH,
  PROFILE_COVER_DESCRIPTION_LENGTH,
  PROFILE_COVER_TITLE_LENGTH,
  PROFILE_DESCRIPTION_LENGTH,
} from '../constants/schema'

export class CreateOrUpdateProfileRequestDto {
  @Length(1, PROFILE_COVER_TITLE_LENGTH)
  @DtoProperty({ required: false })
  coverTitle?: string

  @Length(1, PROFILE_COVER_DESCRIPTION_LENGTH)
  @DtoProperty({ required: false })
  coverDescription?: string

  @Length(1, PROFILE_DESCRIPTION_LENGTH)
  @DtoProperty({ required: false })
  description?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  instagramUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  tiktokUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  youtubeUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  discordUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  facebookUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ required: false })
  twitchUrl?: string
}
