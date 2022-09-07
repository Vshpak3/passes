import { DtoProperty } from '../../../web/dto.web'

export class SearchFollowRequestDto {
  @DtoProperty({ required: false })
  query?: string

  @DtoProperty({ required: false })
  cursor?: string
}
