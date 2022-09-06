import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'

export class CreateContentRequestDto {
  @DtoProperty()
  url: string

  @DtoProperty({ enum: ContentTypeEnum })
  contentType: ContentTypeEnum
}
