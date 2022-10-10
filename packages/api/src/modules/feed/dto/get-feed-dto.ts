import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { PostDto } from '../../post/dto/post.dto'

export class GetFeedRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {}

export class GetFeedResponseDto
  extends GetFeedRequestDto
  implements PageResponseDto<PostDto>
{
  @DtoProperty({ custom_type: [PostDto] })
  data: PostDto[]

  constructor(posts: PostDto[], requestDto: GetFeedRequestDto) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.data = posts
    if (posts.length > 0) {
      this.lastId = posts[posts.length - 1].postId
      this.createdAt = posts[posts.length - 1].createdAt
    }
  }
}
