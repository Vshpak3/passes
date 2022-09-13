import { IsInt, IsUUID, Min } from 'class-validator'

import { DtoProperty } from '../../web/dto.web'

export class TagDto {
  @IsInt()
  @Min(0)
  @DtoProperty()
  index: number

  @IsUUID()
  @DtoProperty()
  userId: string
}
