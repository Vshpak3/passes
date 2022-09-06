import { DtoProperty } from '../../../web/endpoint.web'
import { PostDto } from '../../post/dto/post.dto'

export class GetGalleryViewDto {
  @DtoProperty({ type: [PostDto] })
  paid: PostDto[]

  @DtoProperty({ type: [PostDto] })
  unpaid: PostDto[]

  constructor(posts: PostDto[]) {
    this.paid = posts.filter((post) => !post.paywall)
    this.unpaid = posts.filter((post) => post.paywall)
  }
}
