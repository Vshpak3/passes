import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class RenewPassHolderRequestDto {
  @DtoProperty({ type: 'uuid' })
  passHolderId: string

  @DtoProperty({ custom_type: PayinMethodDto, optional: true })
  payinMethod?: PayinMethodDto
}
