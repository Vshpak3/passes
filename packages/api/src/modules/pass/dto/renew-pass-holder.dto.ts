import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class RenewPassHolderRequestDto {
  @IsUUID()
  @DtoProperty()
  passHolderId: string

  @DtoProperty({ required: false })
  payinMethod?: PayinMethodDto
}
