import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CircleStatusResponseDto } from '../circle/status.dto'
import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class CircleCardPayinEntryRequestDto extends PayinEntryRequestDto {
  @ApiProperty()
  ip: string

  @IsUUID()
  @ApiProperty()
  sessionId: string
}

export class CircleCardPayinEntryResponseDto extends PayinEntryResponseDto {
  @ApiProperty()
  status: CircleStatusResponseDto
}
