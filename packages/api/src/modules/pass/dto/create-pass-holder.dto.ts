import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePassHolderRequestDto {
  @DtoProperty({ type: 'uuid' })
  passId: string

  @DtoProperty({ type: 'string', optional: true })
  walletAddress?: string

  @DtoProperty({ custom_type: PayinMethodDto, optional: true })
  payinMethod?: PayinMethodDto
}
