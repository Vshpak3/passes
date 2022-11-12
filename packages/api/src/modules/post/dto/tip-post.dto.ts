import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'
import { MIN_POST_TIP_PRICE } from '../constants/limits'

export class TipPostRequestDto {
  @DtoProperty({ type: 'uuid' })
  postId: string

  @Min(MIN_POST_TIP_PRICE)
  @DtoProperty({ type: 'currency' })
  amount: number

  @DtoProperty({ custom_type: PayinMethodDto, optional: true })
  payinMethod?: PayinMethodDto
}
