import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/endpoint.web'
import { CirclePaymentDto } from './circle-payment.dto'
import { CircleTransferDto } from './circle-transfer.dto'

export class GenericCircleObjectWrapper {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  status: string
}

export class CircleNotificationDto {
  @IsUUID()
  @DtoProperty()
  clientId: string

  //type is not enum since API could change and we receive unknown update
  @DtoProperty()
  notificationType: string

  @DtoProperty()
  version: number

  //payments flow
  @DtoProperty({ required: false })
  payment?: CirclePaymentDto

  @DtoProperty({ required: false })
  reversal?: any

  @DtoProperty({ required: false })
  chargeback?: any

  //payouts flow
  @DtoProperty({ required: false })
  payout?: any

  @DtoProperty({ required: false })
  return?: any

  //settlement flow
  @DtoProperty({ required: false })
  settlement?: any

  //card verification flow
  @DtoProperty({ required: false })
  card?: GenericCircleObjectWrapper

  //ach verification flow
  @DtoProperty({ required: false })
  ach?: any

  //bank account verification flow
  @DtoProperty({ required: false })
  wire?: GenericCircleObjectWrapper

  //transfer flow
  @DtoProperty({ required: false })
  transfer?: CircleTransferDto
}
