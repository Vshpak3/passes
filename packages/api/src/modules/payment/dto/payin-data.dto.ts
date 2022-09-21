import { IsEnum, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { SHA256_LENGTH } from '../constants/schema'
import { BlockedReasonEnum } from '../enum/blocked-reason.enum'

export class PayinDataDto {
  @Min(0)
  @DtoProperty()
  amount: number

  @Length(1, SHA256_LENGTH)
  @DtoProperty({ optional: true })
  target?: string

  @IsEnum(BlockedReasonEnum)
  @DtoProperty({ enum: BlockedReasonEnum, optional: true })
  blocked?: BlockedReasonEnum
}
