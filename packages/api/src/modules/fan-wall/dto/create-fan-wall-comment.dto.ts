import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { FanWallCommentDto } from './fan-wall-comment.dto'

export class CreateFanWallCommentRequestDto extends PickType(
  FanWallCommentDto,
  ['creatorId', 'text', 'tags'] as const,
) {}

export class CreateFanWallCommentResponseDto {
  @DtoProperty({ type: 'uuid' })
  fanWallCommentId: string

  constructor(fanWallCommentId: string) {
    this.fanWallCommentId = fanWallCommentId
  }
}
