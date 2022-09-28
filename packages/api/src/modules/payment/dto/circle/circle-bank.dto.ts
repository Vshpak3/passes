import { DtoProperty } from '../../../../web/dto.web'
import { CircleBankEntity } from '../../entities/circle-bank.entity'
import { CircleAccountStatusEnum } from '../../enum/circle-account.status.enum'

export class CircleBankDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'uuid', nullable: true, optional: true })
  circleId?: string | null

  @DtoProperty({ custom_type: CircleAccountStatusEnum })
  status: CircleAccountStatusEnum

  @DtoProperty({ type: 'string' })
  description: string

  @DtoProperty({ type: 'string' })
  country: string

  constructor(bank: CircleBankEntity | undefined) {
    if (bank) {
      this.id = bank.id
      this.circleId = bank.circle_id
      this.status = bank.status
      this.description = bank.description
      this.country = bank.country
    }
  }
}
