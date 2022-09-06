import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePassHolderRequestDto {
  @IsUUID()
  @DtoProperty()
  passId: string

  @DtoProperty({ required: false })
  payinMethod?: PayinMethodDto
}
