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
  @DtoProperty({ optional: true })
  coverTitle?: string

  @Length(1, PROFILE_COVER_DESCRIPTION_LENGTH)
  @DtoProperty({ optional: true })
  coverDescription?: string

  @Length(1, PROFILE_DESCRIPTION_LENGTH)
  @DtoProperty({ optional: true })
  description?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ optional: true, forceLower: true })
  instagramUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ optional: true, forceLower: true })
  tiktokUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ optional: true, forceLower: true })
  youtubeUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ optional: true, forceLower: true })
  discordUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ optional: true, forceLower: true })
  facebookUrl?: string

  @Length(1, EXTERNAL_URL_LENGTH)
  @DtoProperty({ optional: true, forceLower: true })
  twitchUrl?: string
}
