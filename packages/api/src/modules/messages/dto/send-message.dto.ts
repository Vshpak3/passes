import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class SendMessageRequestDto {
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

  @ApiProperty()
  content: string[]
}
