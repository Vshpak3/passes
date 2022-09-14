import { DtoProperty } from '../../../web/dto.web'

export class SearchFollowRequestDto {
  @DtoProperty({ optional: true })
  query?: string

  @DtoProperty({ optional: true })
  cursor?: string
}
