import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { PayinCallbackInput } from '../callback.types'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinMethodDto } from './payin-method.dto'

export class RegisterPayinResponseDto {
  @IsUUID()
  @ApiProperty()
  payinId: string

  @ApiProperty()
  payinMethod: PayinMethodDto

  @ApiProperty()
  amount: number
}

export class RegisterPayinRequestDto {
  @IsUUID()
  @ApiProperty()
  userId: string

  @ApiProperty()
  amount: number

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto

  // callback
  @ApiProperty({ enum: PayinCallbackEnum })
  callback: PayinCallbackEnum

  @ApiProperty()
  callbackInputJSON: PayinCallbackInput

  // target object
  @ApiPropertyOptional()
  target?: string

  @IsUUID()
  @ApiProperty()
  creatorId: string
}

export class CreatorShareDto {
  @IsUUID()
  @ApiProperty()
  creatorId: string

  @ApiProperty()
  amount: number
}
