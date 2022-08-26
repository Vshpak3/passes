import { ApiProperty } from '@nestjs/swagger'

import { PostDto } from './post.dto'

export class GetFeedRequestDto {
  @ApiProperty({ type: [PostDto] })
  posts: PostDto[]

  @ApiProperty()
  count: number

  @ApiProperty()
  cursor: string

  constructor(posts: PostDto[], cursor: string) {
    this.posts = posts
    this.count = posts.length
    this.cursor = cursor
  }
}
