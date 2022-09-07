import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class AdminDto {
  @IsUUID()
  @DtoProperty({ required: false })
  userId?: string

  @DtoProperty({ required: false })
  username?: string

  @DtoProperty()
  secret: string
}
