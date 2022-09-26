import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PostHistoryDto } from './post-history.dto'

export class GetPostHistoryRequestDto {
  @IsUUID()
  @DtoProperty()
  postId: string

  @DtoProperty()
  start: Date

  @DtoProperty()
  end: Date
}

export class GetPostHistoryResponseDto {
  @DtoProperty()
  postHistories: PostHistoryDto[]

  constructor(postHistories) {
    this.postHistories = postHistories
  }
}
