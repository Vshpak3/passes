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
  @DtoProperty({ required: false })
  address?: string

  @DtoProperty({ required: false })
  chain?: string

  //for all other payments
  @DtoProperty({ required: false })
  id?: string

  @DtoProperty({ required: false })
  identities?: any
}

export type CircleDestinationDto = CircleSourceDto
