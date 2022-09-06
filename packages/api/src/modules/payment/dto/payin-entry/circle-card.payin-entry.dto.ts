import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { CircleStatusResponseDto } from '../circle/status.dto'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class CircleCardPayinEntryRequestDto extends PayinEntryRequestDto {
  @DtoProperty()
  ip: string

  @IsUUID()
  @DtoProperty()
  sessionId: string
}

export class CircleCardPayinEntryResponseDto extends PayinEntryResponseDto {
  @DtoProperty()
  status: CircleStatusResponseDto
}
