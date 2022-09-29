import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinCallbackInput } from '../callback.types'
import { SHA256_LENGTH } from '../constants/schema'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinMethodDto } from './payin-method.dto'

export class RegisterPayinResponseDto {
  @DtoProperty({ type: 'uuid' })
  payinId: string

  @DtoProperty({ custom_type: PayinMethodDto })
  payinMethod: PayinMethodDto

  @Min(0)
  @DtoProperty({ type: 'currency' })
  amount: number
}

export class RegisterPayinRequestDto {
  @DtoProperty({ type: 'uuid' })
  userId: string

  @Min(0)
  @DtoProperty({ type: 'currency' })
  amount: number

  @DtoProperty({ custom_type: PayinMethodDto, optional: true })
  payinMethod?: PayinMethodDto

  // callback
  @DtoProperty({ custom_type: PayinCallbackEnum })
  callback: PayinCallbackEnum

  // TODO: how to handle since subtyped
  @DtoProperty({ custom_type: 'any' })
  callbackInputJSON: PayinCallbackInput

  // target object
  @Length(1, SHA256_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  target?: string

  @DtoProperty({ type: 'uuid' })
  creatorId: string
}

export class CreatorShareDto {
  @DtoProperty({ type: 'uuid' })
  creatorId: string

  @Min(0)
  @DtoProperty({ type: 'currency' })
  amount: number
}
