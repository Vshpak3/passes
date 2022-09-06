import { ApiProperty } from '@nestjs/swagger'

import { FanWallCommentDto } from './fan-wall-comment.dto'

export class GetFanWallForCreatorResponseDto {
  @ApiProperty({ type: [FanWallCommentDto] })
  comments: FanWallCommentDto[]

  constructor(commentEntities) {
    this.comments = commentEntities.map((c) => new FanWallCommentDto(c))
  }
}
