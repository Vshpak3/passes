import { Length } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { EXTERNAL_URL_LENGTH } from '../../../wallet/constants/schema'
import { IP_ADDRESS_LENGTH } from '../../constants/schema'
import { CircleStatusResponseDto } from '../circle/status.dto'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class CircleCardPayinEntryRequestDto extends PayinEntryRequestDto {
  @Length(0, IP_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  ip: string

  @Length(0, EXTERNAL_URL_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  successUrl?: string

  @Length(0, EXTERNAL_URL_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  failureUrl?: string

  @DtoProperty({ type: 'string' })
  sessionId: string
}

export class CircleCardPayinEntryResponseDto extends PayinEntryResponseDto {
  @DtoProperty({ custom_type: CircleStatusResponseDto })
  status: CircleStatusResponseDto

  @DtoProperty({ type: 'boolean' })
  actionRequired: boolean
}
