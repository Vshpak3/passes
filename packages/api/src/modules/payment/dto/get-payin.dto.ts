import { IsInt, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinDto } from './payin.dto'

export class GetPayinsRequestDto {
  @IsInt()
  @Min(0)
  @DtoProperty()
  offset: number

  @IsInt()
  @Min(1)
  @DtoProperty()
  limit: number
}

export class GetPayinsResponseDto {
  @DtoProperty()
  count: number

  @DtoProperty({ type: [PayinDto] })
  payins: PayinDto[]
}
