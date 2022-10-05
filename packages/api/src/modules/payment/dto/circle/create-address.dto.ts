import { Length } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'

export class CircleCreateAddressRequestDto {
  @DtoProperty({ type: 'uuid' })
  idempotencyKey: string

  @Length(3, 3) // eslint-disable-line no-magic-numbers
  @DtoProperty({ type: 'string' })
  currency: string

  @Length(3, 5) // eslint-disable-line no-magic-numbers
  @DtoProperty({ type: 'string' })
  chain: string
}
