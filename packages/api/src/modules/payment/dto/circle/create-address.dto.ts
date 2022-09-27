import { Length } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'

export class CircleCreateAddressRequestDto {
  @DtoProperty({ type: 'uuid' })
  idempotencyKey: string

  @Length(3, 3)
  @DtoProperty({ type: 'string' })
  currency: string

  @Length(3, 5)
  @DtoProperty({ type: 'string' })
  chain: string
}
