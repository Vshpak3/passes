import { ApiProperty } from '@nestjs/swagger'

import { CircleStatusDto } from '../circle/status.dto'
import { PayinEntryInputDto, PayinEntryOutputDto } from './payin-entry.dto'

export class CircleCardPayinEntryInputDto extends PayinEntryInputDto {
  @ApiProperty()
  ip: string

  @ApiProperty()
  sessionId: string
}

export class CircleCardPayinEntryOutputDto extends PayinEntryOutputDto {
  @ApiProperty()
  status: CircleStatusDto
}
