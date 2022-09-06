import { ApiProperty } from '@nestjs/swagger'

import { PostDto } from '../../post/dto/post.dto'

export class GetGalleryViewDto {
  @ApiProperty({ type: [PostDto] })
  paid: PostDto[]

  @ApiProperty({ type: [PostDto] })
  unpaid: PostDto[]

  constructor(posts: PostDto[]) {
    this.paid = posts.filter((post) => !post.paywall)
    this.unpaid = posts.filter((post) => post.paywall)
  }
}
