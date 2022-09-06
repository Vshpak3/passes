import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class CreateBatchMessageRequestDto {
  @DtoProperty()
  listIds: string[]

  @DtoProperty()
  passIds: string[]

  @IsUUID()
  @DtoProperty()
  postId: string
}
