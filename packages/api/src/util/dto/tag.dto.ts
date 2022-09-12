import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../web/dto.web'

export class TagDto {
  @DtoProperty()
  index: number

  @IsUUID()
  @DtoProperty()
  userId: string
}
