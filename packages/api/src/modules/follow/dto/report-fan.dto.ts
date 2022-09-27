import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { REASON_FOR_BLOCKING_LENGTH } from '../constants/schema'

export class ReportFanDto {
  @Length(1, REASON_FOR_BLOCKING_LENGTH)
  @DtoProperty({ type: 'string' })
  reason: string
}
