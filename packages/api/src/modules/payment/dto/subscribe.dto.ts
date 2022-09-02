import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { PayinMethodDto } from './payin-method.dto'

export class SubscribeResponseDto {
  @IsUUID()
  @ApiProperty()
  subscriptionId: string

  @ApiProperty()
  payinMethod: PayinMethodDto
}

export class SubscribeRequestDto {
  @IsUUID()
  @ApiProperty()
  userId: string

  @ApiProperty()
  amount: number

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto

  @IsUUID()
  @ApiProperty()
  passHolderId: string
}
