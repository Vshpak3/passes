import { PickType } from '@nestjs/swagger'

import { SendMessageRequestDto } from './send-message.dto'

export class CreateWelcomeMessageRequestDto extends PickType(
  SendMessageRequestDto,
  ['price', 'contentIds', 'text', 'previewIndex'],
) {}
