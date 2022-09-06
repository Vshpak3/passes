import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from './payin-method.dto'

export class SubscribeResponseDto {
  @IsUUID()
  @DtoProperty()
  subscriptionId: string

  @DtoProperty()
  payinMethod: PayinMethodDto
}

export class SubscribeRequestDto {
  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  amount: number

  @DtoProperty({ required: false })
  payinMethod?: PayinMethodDto

  @IsUUID()
  @DtoProperty()
  passHolderId: string
}
