import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from './payin-method.dto'

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

  @ApiProperty()
  passHolderId: string
}
