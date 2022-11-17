import { DtoProperty } from '../../../web/dto.web'

export class ReadChannelRequestDto {
  @DtoProperty({ type: 'uuid' })
  channelId: string

  @DtoProperty({ type: 'uuid' })
  otherUserId: string
}
