import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePassHolderRequestDto {
  @IsUUID()
  @DtoProperty()
  passId: string

  @DtoProperty({ optional: true })
  payinMethod?: PayinMethodDto
}
