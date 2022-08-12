import {
  ExamplePayinCallbackInput,
  MessagePayinCallbackInput,
  NftPassPayinCallbackInput,
} from './callback.types'
import { PayinCallbackEnum } from './enum/payin.callback.enum'
import { NoPayinMethodError } from './error/payin.error'

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
): Promise<void> {
  //TODO
}

export async function messageFailureCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: MessagePayinCallbackInput,
): Promise<void> {
  //TODO
}

export async function messageCreationCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: MessagePayinCallbackInput,
): Promise<void> {
  //TODO
}

export async function nftPassSuccessCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: NftPassPayinCallbackInput,
): Promise<void> {
  //TODO
}

export async function nftPassFailureCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: NftPassPayinCallbackInput,
): Promise<void> {
  //TODO
}

export async function nftPassCreationCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: NftPassPayinCallbackInput,
): Promise<void> {
  //TODO
}

export async function examplePassSuccessCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: ExamplePayinCallbackInput,
): Promise<void> {
  console.log('success')
  //TODO
}

export async function examplePassFailureCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: ExamplePayinCallbackInput,
): Promise<void> {
  console.log('fail')
  //TODO
}

export async function examplePassCreationCallback(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input: ExamplePayinCallbackInput,
): Promise<void> {
  console.log('create')
  //TODO
}
