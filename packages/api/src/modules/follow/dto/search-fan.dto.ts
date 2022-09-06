import { DtoProperty } from '../../../web/dto.web'

export class SearchFanRequestDto {
  @DtoProperty()
  query: string

  @DtoProperty({ required: false })
  cursor?: string
}
