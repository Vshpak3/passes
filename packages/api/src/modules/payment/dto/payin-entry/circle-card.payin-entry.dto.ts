import { Length } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { IP_ADDRESS_LENGTH } from '../../constants/schema'
import { CircleStatusResponseDto } from '../circle/status.dto'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class CircleCardPayinEntryRequestDto extends PayinEntryRequestDto {
  @Length(1, IP_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  ip: string

  @DtoProperty({ type: 'string' })
  sessionId: string
}

export class CircleCardPayinEntryResponseDto extends PayinEntryResponseDto {
  @DtoProperty({ custom_type: CircleStatusResponseDto })
  status: CircleStatusResponseDto
}
