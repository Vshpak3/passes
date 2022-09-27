import { Min } from 'class-validator'

import { DtoProperty } from '../../web/dto.web'

export class TagDto {
  @Min(0)
  @DtoProperty({ type: 'number' })
  index: number

  @DtoProperty({ type: 'uuid' })
  userId: string
}
