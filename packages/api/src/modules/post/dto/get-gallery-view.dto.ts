import { DtoProperty } from '../../../web/dto.web'
import { PostDto } from '../../post/dto/post.dto'

export class GetGalleryViewDto {
  @DtoProperty({ custom_type: [PostDto] })
  paid: PostDto[]

  @DtoProperty({ custom_type: [PostDto] })
  unpaid: PostDto[]

  constructor(posts: PostDto[]) {
    this.paid = posts.filter((post) => !post.purchasable)
    this.unpaid = posts.filter((post) => post.purchasable)
  }
}
