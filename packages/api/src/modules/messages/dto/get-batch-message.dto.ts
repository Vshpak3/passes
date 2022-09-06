import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class GetBatchMessageResponseDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  text: string

  @DtoProperty()
  list: string

  @DtoProperty({ required: false })
  content?: string[]

  @DtoProperty({ required: false })
  lastProcessed?: string // listMemberEntity id

  constructor(
    id: string,
    text: string,
    list: string,
    content?: string[],
    lastProcessed?: string,
  ) {
    this.id = id
    this.text = text
    this.list = list
    this.content = content
    this.lastProcessed = lastProcessed
  }
}
