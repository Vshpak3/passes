import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'

export class CreateContentRequestDto {
  @DtoProperty({ custom_type: ContentTypeEnum })
  contentType: ContentTypeEnum

  @DtoProperty({ type: 'boolean' })
  inPost: boolean

  @DtoProperty({ type: 'boolean' })
  inMessage: boolean

  @DtoProperty({ type: 'number' })
  contentLength: number
}
