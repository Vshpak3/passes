import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { FanWallCommentDto } from './fan-wall-comment.dto'

export class GetFanWallRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {
  @DtoProperty({ type: 'uuid' })
  creatorId: string
}

export class GetFanWallResponseDto extends PageResponseDto {
  @DtoProperty({ custom_type: [FanWallCommentDto] })
  comments: FanWallCommentDto[]

  constructor(comments: FanWallCommentDto[]) {
    super()
    this.comments = comments
    if (comments.length > 0) {
      this.lastId = comments[comments.length - 1].fanWallCommentId
      this.createdAt = comments[comments.length - 1].createdAt
    }
  }
}
