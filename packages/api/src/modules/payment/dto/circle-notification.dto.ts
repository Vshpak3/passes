import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PaymentDto } from './payment.dto'

export class CircleNotificationDto {
  @ApiProperty()
  clientId: string
  //type is not enum since API could change and we receive unknown update
  @ApiProperty()
  notificationType: string
  @ApiProperty()
  version: number

  //payments flow
  @ApiPropertyOptional()
  payment?: PaymentDto
  @ApiPropertyOptional()
  reversal?: any
  @ApiPropertyOptional()
  chargeback?: any

  //payouts flow
  @ApiPropertyOptional()
  payout?: any
  @ApiPropertyOptional()
  return?: any

  //settlement flow
  @ApiPropertyOptional()
  settlement?: any

  //card verification flow
  @ApiPropertyOptional()
  card?: any

  //ach verification flow
  @ApiPropertyOptional()
  ach?: any

  //bank account verification flow
  @ApiPropertyOptional()
  wire?: any

  //transfer flow
  @ApiPropertyOptional()
  transfer?: any
}
