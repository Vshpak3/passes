import { DtoProperty } from '../../../../web/dto.web'

export class CircleCreateAddressRequestDto {
  @DtoProperty()
  idempotencyKey: string

  @DtoProperty()
  currency: string

  @DtoProperty()
  chain: string
}
