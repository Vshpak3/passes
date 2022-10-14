import { DtoProperty } from '../../../../web/dto.web'
import { CirclePaymentStatusEnum } from '../../enum/circle-payment.status.enum'
import { CircleRequiredActionDto } from './circle-required-action.dto'
import { CircleAmountDto, CircleSourceDto } from './circle-utils.dto'

export class CirclePaymentDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'string' })
  type: string

  @DtoProperty({ custom_type: CircleAmountDto })
  amount: CircleAmountDto

  @DtoProperty({ custom_type: CircleSourceDto })
  source: CircleSourceDto

  @DtoProperty({ custom_type: CirclePaymentStatusEnum })
  status: CirclePaymentStatusEnum

  @DtoProperty({ type: 'uuid' })
  merchantId: string

  @DtoProperty({ type: 'uuid' })
  merchantWalletId: string

  @DtoProperty({ type: 'string', optional: true })
  description?: string

  @DtoProperty({ custom_type: CircleRequiredActionDto, optional: true })
  requiredAction?: CircleRequiredActionDto
}
