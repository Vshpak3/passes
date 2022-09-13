import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'

export class CircleCreateAddressRequestDto {
  @IsUUID()
  @DtoProperty()
  idempotencyKey: string

  @Length(3, 3)
  @DtoProperty()
  currency: string

  @Length(3, 5)
  @DtoProperty()
  chain: string
}
