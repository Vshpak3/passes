import { DtoProperty } from '../../../../web/dto.web'
import { CircleChargebackDto } from './circle-chargeback.dto'
import { CirclePaymentDto } from './circle-payment.dto'
import { CircleTransferDto } from './circle-transfer.dto'

export class GenericCircleObjectWrapper {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'string' })
  status: string
}

export class CircleNotificationDto {
  @DtoProperty({ type: 'uuid' })
  clientId: string

  //type is not enum since API could change and we receive unknown update
  @DtoProperty({ type: 'string' })
  notificationType: string

  @DtoProperty({ type: 'number' })
  version: number

  //payments flow
  @DtoProperty({ custom_type: CirclePaymentDto, optional: true })
  payment?: CirclePaymentDto

  @DtoProperty({ type: 'any', optional: true })
  reversal?: any

  @DtoProperty({ custom_type: CircleChargebackDto, optional: true })
  chargeback?: CircleChargebackDto

  //payouts flow
  @DtoProperty({ type: 'any', optional: true })
  payout?: any

  @DtoProperty({ type: 'any', optional: true })
  return?: any

  //settlement flow
  @DtoProperty({ type: 'any', optional: true })
  settlement?: any

  //card verification flow
  @DtoProperty({ custom_type: GenericCircleObjectWrapper, optional: true })
  card?: GenericCircleObjectWrapper

  //ach verification flow
  @DtoProperty({ type: 'any', optional: true })
  ach?: any

  //bank account verification flow
  @DtoProperty({ custom_type: GenericCircleObjectWrapper, optional: true })
  wire?: GenericCircleObjectWrapper

  //transfer flow
  @DtoProperty({ custom_type: CircleTransferDto, optional: true })
  transfer?: CircleTransferDto
}
