import { DtoProperty } from '../../../web/dto.web'
import { ContentBareDto } from './content-bare'

export class ContentValidationDto {
  @DtoProperty({ custom_type: [ContentBareDto] })
  contentsBare: ContentBareDto[]

  @DtoProperty({ type: 'boolean' })
  isProcessed: boolean

  constructor(contentsBare: ContentBareDto[], isProcessed: boolean) {
    this.contentsBare = contentsBare
    this.isProcessed = isProcessed
  }
}
