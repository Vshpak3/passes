import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Min } from 'class-validator'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'
import { MINIMUM_POST_TIP_AMOUNT } from '../post.service'

export class TipPostRequestDto {
  @ApiProperty()
  postId: string

  @Min(MINIMUM_POST_TIP_AMOUNT)
  @ApiProperty()
  amount: number

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
