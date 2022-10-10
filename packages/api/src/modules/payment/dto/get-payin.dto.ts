import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinDto } from './payin.dto'

export class GetPayinsRequestDto {
  @Min(0)
  @DtoProperty({ type: 'number' })
  offset: number

  @Min(1)
  @DtoProperty({ type: 'number' })
  limit: number

  @DtoProperty({ type: 'boolean', optional: true })
  inProgress?: boolean
}

export class GetPayinsResponseDto {
  @Min(0)
  @DtoProperty({ type: 'number' })
  count: number

  @DtoProperty({ custom_type: [PayinDto] })
  payins: PayinDto[]
}
