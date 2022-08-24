import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class SendMessageDto {
  @ApiProperty()
  text: string

  @ApiProperty()
  attachments: any[]

  @ApiProperty()
  channelId: string

  @ApiPropertyOptional()
  tipAmount?: number

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
