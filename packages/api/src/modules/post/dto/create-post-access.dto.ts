import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePostAccessRequestDto {
  @IsUUID()
  @DtoProperty()
  postId: string

  @DtoProperty()
  fromDM: boolean

  @DtoProperty({ optional: true })
  payinMethod?: PayinMethodDto
}
