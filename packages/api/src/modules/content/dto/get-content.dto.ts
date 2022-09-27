import { DtoProperty } from '../../../web/dto.web'
import { ContentDto } from './content.dto'

export class GetContentResponseDto extends ContentDto {}

export class GetContentsResponseDto {
  @DtoProperty({ custom_type: [ContentDto] })
  contents: ContentDto[]

  constructor(contents: ContentDto[]) {
    this.contents = contents
  }
}
