import { DtoProperty } from '../../../web/endpoint.web'

export class CreateOrUpdateProfileRequestDto {
  @DtoProperty({ required: false })
  displayName?: string

  @DtoProperty({ required: false })
  coverTitle?: string

  @DtoProperty({ required: false })
  coverDescription?: string

  @DtoProperty({ required: false })
  description?: string

  @DtoProperty({ required: false })
  instagramUrl?: string

  @DtoProperty({ required: false })
  tiktokUrl?: string

  @DtoProperty({ required: false })
  youtubeUrl?: string

  @DtoProperty({ required: false })
  discordUrl?: string

  @DtoProperty({ required: false })
  twitchUrl?: string
}
