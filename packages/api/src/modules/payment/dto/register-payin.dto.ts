import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinCallbackInput } from '../callback.types'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinMethodDto } from './payin-method.dto'
import { PayinTargetDto } from './payin-target.dto'

export class RegisterPayinResponseDto {
  @ApiProperty()
  payinId: string

  @ApiProperty()
  payinMethod: PayinMethodDto

  @ApiProperty()
  amount: number
}

export class RegisterPayinRequestDto {
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

  @ApiProperty()
  creatorShares: Array<CreatorShareDto>

  // target object
  @ApiProperty()
  payinTarget: PayinTargetDto
}

export class CreatorShareDto {
  @ApiProperty()
  creatorId: string

  @ApiProperty()
  amount: number
}
