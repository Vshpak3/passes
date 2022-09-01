import { ApiProperty } from '@nestjs/swagger'

import { CommentDto } from './comment.dto'

export class GetFanWallForCreatorResponseDto {
  @ApiProperty({ type: [CommentDto] })
  comments: CommentDto[]

  constructor(commentEntities) {
    this.comments = commentEntities.map((c) => new CommentDto(c))
  }
}
