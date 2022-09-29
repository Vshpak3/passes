import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'
import { MINIMUM_POST_TIP_AMOUNT } from '../post.service'

export class TipPostRequestDto {
  @DtoProperty({ type: 'uuid' })
  postId: string

  @Min(MINIMUM_POST_TIP_AMOUNT)
  @DtoProperty({ type: 'currency' })
  amount: number

  @DtoProperty({ custom_type: PayinMethodDto, optional: true })
  payinMethod?: PayinMethodDto
}
