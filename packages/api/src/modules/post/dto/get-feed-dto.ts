import { ApiProperty } from '@nestjs/swagger'

import { GetPostDto } from './get-post.dto'

export class GetFeedDto {
  @ApiProperty({ type: [GetPostDto] })
  posts: GetPostDto[]

  @ApiProperty()
  count: number

  @ApiProperty()
  cursor: string

  constructor(posts: GetPostDto[], cursor: string) {
    this.posts = posts
    this.count = posts.length
    this.cursor = cursor
  }
}
