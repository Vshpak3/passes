import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { SHA256_LENGTH } from '../constants/schema'
import { BlockedReasonEnum } from '../enum/blocked-reason.enum'

export class PayinDataDto {
  @Min(0)
  @DtoProperty({ type: 'currency' })
  amount: number

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  amountEth?: number

  @Length(1, SHA256_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  target?: string

  @DtoProperty({ custom_type: BlockedReasonEnum, optional: true })
  blocked?: BlockedReasonEnum
}
