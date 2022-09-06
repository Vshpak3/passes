import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePostAccessRequestDto {
  @IsUUID()
  @DtoProperty()
  postId: string

  @DtoProperty()
  fromDM: boolean

  @DtoProperty({ required: false })
  payinMethod?: PayinMethodDto
}
