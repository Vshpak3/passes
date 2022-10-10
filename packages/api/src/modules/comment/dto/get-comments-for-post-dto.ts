import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { CommentDto } from './comment.dto'

export class GetCommentsForPostRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {
  @DtoProperty({ type: 'uuid' })
  postId: string
}

export class GetCommentsForPostResponseDto
  extends GetCommentsForPostRequestDto
  implements PageResponseDto<CommentDto>
{
  @DtoProperty({ custom_type: [CommentDto] })
  data: CommentDto[]

  constructor(
    comments: CommentDto[],
    requestDto: GetCommentsForPostRequestDto,
  ) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.data = comments
    if (comments.length > 0) {
      this.lastId = comments[comments.length - 1].commentId
      this.createdAt = comments[comments.length - 1].createdAt
    }
  }
}
