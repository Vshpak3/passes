import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'

export class CreateContentRequestDto {
  @DtoProperty({ custom_type: ContentTypeEnum })
  contentType: ContentTypeEnum

  @DtoProperty({ custom_type: ContentTypeEnum })
  inPost: boolean

  @DtoProperty({ custom_type: ContentTypeEnum })
  inMessage: boolean
}
