import { DtoProperty } from '../../../web/endpoint.web'
import { PostDto } from './post.dto'

export class GetFeedRequestDto {
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
