import { DtoProperty } from '../../../web/endpoint.web'

export class SearchFanRequestDto {
  @DtoProperty()
  query: string

  @DtoProperty({ required: false })
  cursor?: string
}
