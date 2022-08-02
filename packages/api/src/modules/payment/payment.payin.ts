import { PaymentEntity } from './entities/payment.entity'
import { PaymentCallbackEnum } from './enum/payment.callback.enum'
import {
  messageFailureCallback,
  messageSuccessCallback,
} from './payment.callback'
import { MessagePaymentCallbackInput } from './types/callback.type'

export function handleFiatPayin(payment: PaymentEntity): void {
  //TODO: implement with fiat provider
  //if success
  handleSuccesfulCallbacks(payment)
}

export function handleCryptoPayin(payment: PaymentEntity): void {
  //TODO: implement with blockchain provider
  //if success
  handleSuccesfulCallbacks(payment)
}

export function handleSuccesfulCallbacks(payment: PaymentEntity): void {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (payment.callback) {
    case PaymentCallbackEnum.MESSAGE: {
      const input = JSON.parse(
        payment.callbackInputJSON,
      ) as MessagePaymentCallbackInput
      messageSuccessCallback(input)
    }
  }
}

export function handleFailedCallbacks(payment: PaymentEntity): void {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (payment.callback) {
    case PaymentCallbackEnum.MESSAGE: {
      const input = JSON.parse(
        payment.callbackInputJSON,
      ) as MessagePaymentCallbackInput
      messageFailureCallback(input)
    }
  }
}
