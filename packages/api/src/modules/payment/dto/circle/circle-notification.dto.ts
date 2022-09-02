import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CirclePaymentDto } from './circle-payment.dto'
import { CircleTransferDto } from './circle-transfer.dto'

export class GenericCircleObjectWrapper {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  status: string
}

export class CircleNotificationDto {
  @IsUUID()
  @ApiProperty()
  clientId: string

  //type is not enum since API could change and we receive unknown update
  @ApiProperty()
  notificationType: string

  @ApiProperty()
  version: number

  //payments flow
  @ApiPropertyOptional()
  payment?: CirclePaymentDto

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
  card?: GenericCircleObjectWrapper

  //ach verification flow
  @ApiPropertyOptional()
  ach?: any

  //bank account verification flow
  @ApiPropertyOptional()
  wire?: GenericCircleObjectWrapper

  //transfer flow
  @ApiPropertyOptional()
  transfer?: CircleTransferDto
}
