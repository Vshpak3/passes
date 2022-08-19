import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from './payin-method.dto'
import { PayinTargetDto } from './payin-target.dto'

export class SubscribeResponseDto {
  @ApiProperty()
  subscriptionId: string

  @ApiProperty()
  payinMethod: PayinMethodDto
}

export class SubscribeRequestDto {
  @ApiProperty()
  userId: string

  @ApiProperty()
  amount: number

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto

  // target object
  @ApiProperty()
  payinTarget: PayinTargetDto
}
