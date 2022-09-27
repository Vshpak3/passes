import { DtoProperty } from '../../../../web/dto.web'
import { CircleAccountStatusEnum } from '../../enum/circle-account.status.enum'

export class CircleBankDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'uuid', optional: true })
  circleId?: string

  @DtoProperty({ custom_type: CircleAccountStatusEnum })
  status: CircleAccountStatusEnum

  @DtoProperty({ type: 'string' })
  description: string

  @DtoProperty({ type: 'string' })
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
