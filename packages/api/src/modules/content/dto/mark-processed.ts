import { PickType } from '@nestjs/swagger'

import { ContentDto } from './content.dto'

export class MarkProcessedRequestDto extends PickType(ContentDto, [
  'contentId',
  'userId',
]) {}
