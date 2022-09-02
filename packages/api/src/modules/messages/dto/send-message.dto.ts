import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class SendMessageRequestDto {
  @ApiProperty()
  text: string

  @ApiProperty()
  attachments: any[]

  @IsUUID()
  @ApiProperty()
  channelId: string

  @ApiPropertyOptional()
  tipAmount?: number

  @ApiProperty()
  content: string[]

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
