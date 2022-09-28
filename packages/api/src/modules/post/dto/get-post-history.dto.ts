import { DtoProperty } from '../../../web/dto.web'
import { PostHistoryDto } from './post-history.dto'

export class GetPostHistoryRequestDto {
  @DtoProperty({ type: 'uuid' })
  postId: string

  @DtoProperty({ type: 'date' })
  start: Date

  @DtoProperty({ type: 'date' })
  end: Date
}

export class GetPostHistoryResponseDto {
  @DtoProperty({ custom_type: [PostHistoryDto] })
  postHistories: PostHistoryDto[]

  constructor(postHistories: PostHistoryDto[]) {
    this.postHistories = postHistories
  }
}
