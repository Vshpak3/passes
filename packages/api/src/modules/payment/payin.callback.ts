// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatabaseService } from '../../database/database.service'
import {
  CreateNftPassPayinCallbackInput,
  CreateNftPassPayinCallbackOutput,
  MessagePayinCallbackInput,
  PayinCallbackInput,
  RenewNftPassPayinCallbackInput,
  RenewNftPassPayinCallbackOutput,
} from './callback.types'
import { PayinDto } from './dto/payin.dto'
import { PayinCallbackEnum } from './enum/payin.callback.enum'
import { NoPayinMethodError } from './error/payin.error'
import { PaymentService } from './payment.service'

export const functionMapping = (key) => {
  switch (key) {
    case PayinCallbackEnum.MESSAGE:
      return {
        success: messageSuccessCallback,
        failure: messageFailureCallback,
        creation: messageCreationCallback,
      }
    case PayinCallbackEnum.CREATE_NFT_PASS:
      return {
        success: createNftPassSuccessCallback,
        failure: empty,
        creation: empty,
      }
    case PayinCallbackEnum.RENEW_NFT_PASS:
      return {
        success: renewNftPassSuccessCallback,
        failure: empty,
        creation: empty,
      }
    case PayinCallbackEnum.EXAMPLE:
      return {
        success: empty,
        failure: empty,
        creation: empty,
      }
    default:
      throw new NoPayinMethodError('no method selected for callback')
  }
}

const empty = async (
  payin: any,
  input: PayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
) => {}

export async function messageSuccessCallback(
  payin: any,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  //TODO
}

export async function messageFailureCallback(
  payin: any,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  //TODO
}

export async function messageCreationCallback(
  payin: any,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  //TODO
}

export async function createNftPassSuccessCallback(
  payin: any,
  input: CreateNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<CreateNftPassPayinCallbackOutput> {
  const newPassOwnership = await payService.passService.createPass(
    input.userId,
    input.passId,
  )
  const payinDto = new PayinDto(payin)
  if (newPassOwnership.expiresAt) {
    await payService.subscribe({
      userId: payinDto.userId,
      passOwnershipId: newPassOwnership.id,
      amount: payinDto.amount,
      payinMethod: payinDto.payinMethod,
    })
  }
  return {
    passOwnershipId: newPassOwnership.id,
    expiresAt: newPassOwnership.expiresAt,
  }
}

export async function renewNftPassSuccessCallback(
  payin: any,
  input: RenewNftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<RenewNftPassPayinCallbackOutput> {
  const expiresAt = await payService.passService.renewPass(
    input.passOwnershipId,
  )
  return {
    passOwnershipId: input.passOwnershipId,
    expiresAt,
  }
}
