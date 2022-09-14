import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { SHA256_LENGTH } from '../constants/schema'

export class PayinDataDto {
  @Min(0)
  @DtoProperty()
  amount: number

  @Length(1, SHA256_LENGTH)
  @DtoProperty({ optional: true })
  target?: string

  @DtoProperty()
  blocked: boolean
}
