import { DtoProperty } from '../../../web/endpoint.web'

export class GetChannelRequestDto {
  @DtoProperty()
  username: string

  @DtoProperty({ required: false })
  userId?: string
}

export class GetChannelResponseDto {
  @DtoProperty()
  channelId: string

  @DtoProperty()
  blocked: boolean
}
