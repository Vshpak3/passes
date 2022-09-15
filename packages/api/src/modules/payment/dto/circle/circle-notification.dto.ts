import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { CircleChargebackDto } from './circle-chargeback.dto'
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
  @DtoProperty({ optional: true })
  payment?: CirclePaymentDto

  @DtoProperty({ optional: true })
  reversal?: any

  @DtoProperty({ optional: true })
  chargeback?: CircleChargebackDto

  //payouts flow
  @DtoProperty({ optional: true })
  payout?: any

  @DtoProperty({ optional: true })
  return?: any

  //settlement flow
  @DtoProperty({ optional: true })
  settlement?: any

  //card verification flow
  @DtoProperty({ optional: true })
  card?: GenericCircleObjectWrapper

  //ach verification flow
  @DtoProperty({ optional: true })
  ach?: any

  //bank account verification flow
  @DtoProperty({ optional: true })
  wire?: GenericCircleObjectWrapper

  //transfer flow
  @DtoProperty({ optional: true })
  transfer?: CircleTransferDto
}
