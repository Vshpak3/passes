import { DtoProperty } from '../../../../web/endpoint.web'

export class CircleCreateAddressRequestDto {
  @DtoProperty()
  idempotencyKey: string

  @DtoProperty()
  currency: string

  @DtoProperty()
  chain: string
}
