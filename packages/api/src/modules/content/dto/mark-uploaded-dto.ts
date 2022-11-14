import { PickType } from '@nestjs/swagger'

import { ContentDto } from './content.dto'

export class MarkUploadedRequestDto extends PickType(ContentDto, [
  'contentId',
]) {}
