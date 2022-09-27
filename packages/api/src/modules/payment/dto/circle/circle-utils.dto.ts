import { DtoProperty } from '../../../../web/dto.web'

export class CircleAmountDto {
  @DtoProperty({ type: 'string' })
  amount: string

  @DtoProperty({ type: 'string' })
  currency: string
}

export class CircleSourceDto {
  @DtoProperty({ type: 'string' })
  type: string

  //for crypto payments
  @DtoProperty({ type: 'string', optional: true })
  address?: string

  @DtoProperty({ type: 'string', optional: true })
  chain?: string

  //for all other payments
  @DtoProperty({ type: 'string', optional: true })
  id?: string

  @DtoProperty({ type: 'any', optional: true })
  identities?: any
}

export class CircleDestinationDto extends CircleSourceDto {}
