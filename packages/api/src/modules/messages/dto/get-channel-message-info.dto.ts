import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class GetChannelMesssageInfoResponseDto {
  @Min(0)
  @DtoProperty({ type: 'number', nullable: true })
  messages: number | null

  @Min(0)
  @DtoProperty({ type: 'number', nullable: true, optional: true })
  minimumTip?: number | null

  constructor(messages: number | null, minimumTip?: number | null) {
    this.messages = messages
    this.minimumTip = minimumTip
  }
}
