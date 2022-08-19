// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatabaseService } from '../../database/database.service'
import {
  ExamplePayinCallbackInput,
  MessagePayinCallbackInput,
  NftPassPayinCallbackInput,
} from './callback.types'
import { SubscriptionEntity } from './entities/subscription.entity'
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
    case PayinCallbackEnum.NFT_PASS:
      return {
        success: nftPassSuccessCallback,
        failure: nftPassFailureCallback,
        creation: nftPassCreationCallback,
      }
    case PayinCallbackEnum.EXAMPLE:
      return {
        success: examplePassSuccessCallback,
        failure: examplePassFailureCallback,
        creation: examplePassCreationCallback,
      }
    default:
      throw new NoPayinMethodError('no method selected for callback')
  }
}

export async function messageSuccessCallback(
  payinId: string,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  //TODO
}

export async function messageFailureCallback(
  payinId: string,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  //TODO
}

export async function messageCreationCallback(
  payinId: string,
  input: MessagePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  //TODO
}

export async function nftPassSuccessCallback(
  payinId: string,
  input: NftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  const newPassOwnership = await payService.passService.extendOrAddHolder(
    input.userId,
    input.passId,
    input.temporary,
  )
  if (newPassOwnership) {
    await payService.fillTargetPass(payinId, newPassOwnership)
  }
}

export async function nftPassFailureCallback(
  payinId: string,
  input: NftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  return
}

export async function nftPassCreationCallback(
  payinId: string,
  input: NftPassPayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  return
}

export async function examplePassSuccessCallback(
  payinId: string,
  input: ExamplePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  // console.log('success')
  //TODO
}

export async function examplePassFailureCallback(
  payinId: string,
  input: ExamplePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  // console.log('fail')
  //TODO
}

export async function examplePassCreationCallback(
  payinId: string,
  input: ExamplePayinCallbackInput,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  // console.log('create')
  //TODO
}
