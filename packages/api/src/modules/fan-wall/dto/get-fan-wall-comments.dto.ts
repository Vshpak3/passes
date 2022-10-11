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

export class GetFanWallResponseDto
  extends GetFanWallRequestDto
  implements PageResponseDto<FanWallCommentDto>
{
  @DtoProperty({ custom_type: [FanWallCommentDto] })
  data: FanWallCommentDto[]

  constructor(comments: FanWallCommentDto[], requestDto: GetFanWallRequestDto) {
    super()
    this.lastId = undefined
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.data = comments
    if (comments.length > 0) {
      this.lastId = comments[comments.length - 1].fanWallCommentId
      this.createdAt = comments[comments.length - 1].createdAt
    }
  }
}
