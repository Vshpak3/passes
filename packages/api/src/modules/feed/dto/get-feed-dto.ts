import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { PostDto } from '../../post/dto/post.dto'

export class GetFeedRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {}

export class GetFeedResponseDto extends PageResponseDto {
  @DtoProperty({ type: [PostDto] })
  posts: PostDto[]

  @DtoProperty()
  count: number

  constructor(posts: PostDto[]) {
    super()
    this.posts = posts
    this.count = posts.length
    if (posts.length > 0) {
      this.lastId = posts[posts.length - 1].postId
      this.createdAt = posts[posts.length - 1].createdAt
    }
  }
}
