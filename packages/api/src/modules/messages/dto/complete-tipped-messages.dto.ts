import { ApiProperty } from '@nestjs/swagger'

import { MessageDto } from './message.dto'

export class GetCompleteTippedMessagedDto {
  @ApiProperty({ type: [MessageDto] })
  messages: MessageDto[]

  constructor(messages: MessageDto[]) {
    this.messages = messages
  }
}
