import { GetPostDto } from '../../post/dto/get-post.dto'

export class GetFeedDto {
  posts: GetPostDto[]
  count: number
  cursor: string

  constructor(posts: GetPostDto[], cursor: string) {
    this.posts = posts
    this.count = posts.length
    this.cursor = cursor
  }
}
