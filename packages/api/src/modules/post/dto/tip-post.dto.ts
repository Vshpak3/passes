import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class TipPostRequestDto {
  @ApiProperty()
  postId: string

  @ApiProperty()
  amount: number

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
