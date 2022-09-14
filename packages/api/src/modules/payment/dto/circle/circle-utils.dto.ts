import { DtoProperty } from '../../../../web/dto.web'

export class CircleAmountDto {
  @DtoProperty()
  amount: string

  @DtoProperty()
  currency: string
}

export class CircleSourceDto {
  @DtoProperty()
  type: string

  //for crypto payments
  @DtoProperty({ optional: true })
  address?: string

  @DtoProperty({ optional: true })
  chain?: string

  //for all other payments
  @DtoProperty({ optional: true })
  id?: string

  @DtoProperty({ optional: true })
  identities?: any
}

export type CircleDestinationDto = CircleSourceDto
