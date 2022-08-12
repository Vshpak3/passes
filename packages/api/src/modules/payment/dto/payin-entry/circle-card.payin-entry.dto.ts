import { ApiProperty } from '@nestjs/swagger'

import { CircleStatusDto } from '../circle/status.dto'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class CircleCardPayinEntryRequestDto extends PayinEntryRequestDto {
  @ApiProperty()
  ip: string

  @ApiProperty()
  sessionId: string
}

export class CircleCardPayinEntryResponseDto extends PayinEntryResponseDto {
  @ApiProperty()
  status: CircleStatusDto
}
