import {
  ExamplePayinCallbackInput,
  MessagePayinCallbackInput,
  NftPassPayinCallbackInput,
} from './callback.types'
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: MessagePayinCallbackInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payService: PaymentService,
): Promise<void> {
  //TODO
}

export async function messageFailureCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: MessagePayinCallbackInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payService: PaymentService,
): Promise<void> {
  //TODO
}

export async function messageCreationCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: MessagePayinCallbackInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payService: PaymentService,
): Promise<void> {
  //TODO
}

export async function nftPassSuccessCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: NftPassPayinCallbackInput,
  payService: PaymentService,
): Promise<void> {
  payService.passService.addHolder(input.userId, input.passId, input.temporary)
}

export async function nftPassFailureCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: NftPassPayinCallbackInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
): Promise<void> {
  // allow them to try to pay again
  //TODO
}

export async function nftPassCreationCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: NftPassPayinCallbackInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payService: PaymentService,
): Promise<void> {
  // don't allow person to click pay button again
  //TODO
}

export async function examplePassSuccessCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: ExamplePayinCallbackInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payService: PaymentService,
): Promise<void> {
  // console.log('success')
  //TODO
}

export async function examplePassFailureCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: ExamplePayinCallbackInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payService: PaymentService,
): Promise<void> {
  // console.log('fail')
  //TODO
}

export async function examplePassCreationCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: ExamplePayinCallbackInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payService: PaymentService,
): Promise<void> {
  // console.log('create')
  //TODO
}
