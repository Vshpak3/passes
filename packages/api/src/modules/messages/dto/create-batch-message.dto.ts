import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class CreateBatchMessageRequestDto {
  @IsUUID('all', { each: true })
  @DtoProperty()
  listIds: string[]

  @IsUUID('all', { each: true })
  @DtoProperty()
  passIds: string[]

  @IsUUID()
  @DtoProperty()
  postId: string
}
