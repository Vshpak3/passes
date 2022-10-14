import { PickType } from '@nestjs/swagger'

import { ContentTypeEnum } from '../enums/content-type.enum'
import { ContentDto } from './content.dto'

export class ContentBareDto extends PickType(ContentDto, [
  'contentId',
  'contentType',
]) {
  constructor(id: string, contentType: ContentTypeEnum) {
    super()
    this.contentId = id
    this.contentType = contentType
  }
}
