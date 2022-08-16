import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinCallbackInput } from '../callback.types'
import { PayinCallbackEnum } from '../enum/payin.callback.enum'
import { PayinMethodEnum } from '../enum/payin.enum'

export class RegisterPayinResponseDto {
  @ApiProperty()
  payinId: string

  @ApiProperty({ enum: PayinMethodEnum })
  method: PayinMethodEnum

  @ApiProperty()
  amount: number
}

export class RegisterPayinRequestDto {
  @ApiProperty()
  userId: string

  @ApiPropertyOptional()
  target?: string

  @ApiProperty()
  amount: number

  @ApiProperty({ enum: PayinCallbackEnum })
  callback: PayinCallbackEnum

  @ApiProperty()
  callbackInputJSON: PayinCallbackInput

  @ApiProperty()
  creatorShares: Array<CreatorShareDto>
}

export class CreatorShareDto {
  @ApiProperty()
  creatorId: string

  @ApiProperty()
  amount: number
}
