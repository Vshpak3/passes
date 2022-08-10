import { ApiProperty } from '@nestjs/swagger'

import { GetPostDto } from '../../post/dto/get-post.dto'

export class GetFeedDto {
  @ApiProperty()
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
