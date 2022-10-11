import { DtoProperty } from '../../../web/dto.web'
import { PostDto } from './post.dto'

export class GetPostsRangeRequestDto {
  @DtoProperty({ type: 'date' })
  startDate: Date

  @DtoProperty({ type: 'date' })
  endDate: Date
}

export class GetPostsRangeResponseDto {
  @DtoProperty({ custom_type: [PostDto] })
  data: PostDto[]

  constructor(posts: PostDto[]) {
    this.data = posts
  }
}
