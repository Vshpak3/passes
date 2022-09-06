import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/endpoint.web'

export class CircleBankDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty({ required: false })
  circleId?: string

  @DtoProperty()
  status: string

  @DtoProperty()
  description: string

  @DtoProperty()
  country: string

  constructor(bank) {
    if (bank) {
      this.id = bank.id
      this.circleId = bank.circle_id
      this.status = bank.status
      this.description = bank.description
      this.country = bank.country
    }
  }
}
