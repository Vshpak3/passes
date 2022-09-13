import { IsEnum, IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinCallbackInput } from '../callback.types'
import { SHA256_LENGTH } from '../constants/schema'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinMethodDto } from './payin-method.dto'

export class RegisterPayinResponseDto {
  @IsUUID()
  @DtoProperty()
  payinId: string

  @DtoProperty()
  payinMethod: PayinMethodDto

  @Min(0)
  @DtoProperty()
  amount: number
}

export class RegisterPayinRequestDto {
  @IsUUID()
  @DtoProperty()
  userId: string

  @Min(0)
  @DtoProperty()
  amount: number

  @DtoProperty({ required: false })
  payinMethod?: PayinMethodDto

  // callback
  @IsEnum(PayinCallbackEnum)
  @DtoProperty({ enum: PayinCallbackEnum })
  callback: PayinCallbackEnum

  @DtoProperty()
  callbackInputJSON: PayinCallbackInput

  // target object
  @Length(1, SHA256_LENGTH)
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

  @Min(0)
  @DtoProperty()
  amount: number
}
