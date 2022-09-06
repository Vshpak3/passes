import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinCallbackInput } from '../callback.types'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinMethodDto } from './payin-method.dto'

export class RegisterPayinResponseDto {
  @IsUUID()
  @DtoProperty()
  payinId: string

  @DtoProperty()
  payinMethod: PayinMethodDto

  @DtoProperty()
  amount: number
}

export class RegisterPayinRequestDto {
  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  amount: number

  @DtoProperty({ required: false })
  payinMethod?: PayinMethodDto

  // callback
  @DtoProperty({ enum: PayinCallbackEnum })
  callback: PayinCallbackEnum

  @DtoProperty()
  callbackInputJSON: PayinCallbackInput

  // target object
  @DtoProperty({ required: false })
  target?: string

  @IsUUID()
  @DtoProperty()
  creatorId: string
}

export class CreatorShareDto {
  @IsUUID()
  @DtoProperty()
  creatorId: string

  @DtoProperty()
  amount: number
}
