import { IsUUID, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'
import { MINIMUM_POST_TIP_AMOUNT } from '../post.service'

export class TipPostRequestDto {
  @IsUUID()
  @DtoProperty()
  postId: string

  @Min(MINIMUM_POST_TIP_AMOUNT)
  @DtoProperty()
  amount: number

  @DtoProperty({ required: false })
  payinMethod?: PayinMethodDto
}
