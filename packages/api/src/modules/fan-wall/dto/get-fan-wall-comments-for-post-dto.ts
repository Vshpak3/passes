import { DtoProperty } from '../../../web/dto.web'
import { FanWallCommentDto } from './fan-wall-comment.dto'

export class GetFanWallForCreatorResponseDto {
  @DtoProperty({ type: [FanWallCommentDto] })
  comments: FanWallCommentDto[]

  constructor(commentEntities) {
    this.comments = commentEntities.map((c) => new FanWallCommentDto(c))
  }
}
