import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class PurchaseMessageRequestDto {
  @DtoProperty({ type: 'uuid' })
  messageId: string

  @DtoProperty({ custom_type: PayinMethodDto, optional: true })
  payinMethod?: PayinMethodDto
}
