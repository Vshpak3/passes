import { IsEnum } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'

export class CreateContentRequestDto {
  @IsEnum(ContentTypeEnum)
  @DtoProperty({ enum: ContentTypeEnum })
  contentType: ContentTypeEnum
}
