import { DtoProperty } from '../../../web/dto.web'
import { PostDto } from '../../post/dto/post.dto'

export class GetFeedResponseDto {
  @DtoProperty({ type: [PostDto] })
  posts: PostDto[]

  @DtoProperty()
  count: number

  @DtoProperty()
  cursor: string

  constructor(posts: PostDto[], cursor: string) {
    this.posts = posts
    this.count = posts.length
    this.cursor = cursor
  }
}
