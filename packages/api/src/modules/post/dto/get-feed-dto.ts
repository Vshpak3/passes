import { DtoProperty } from '../../../web/dto.web'
import { PostDto } from './post.dto'

export class GetFeedRequestDto {
  @DtoProperty({ custom_type: [PostDto] })
  posts: PostDto[]

  @DtoProperty({ type: 'number' })
  count: number

  @DtoProperty({ type: 'string' })
  cursor: string

  constructor(posts: PostDto[], cursor: string) {
    this.posts = posts
    this.count = posts.length
    this.cursor = cursor
  }
}
