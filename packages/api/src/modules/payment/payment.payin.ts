import { EntityRepository } from '@mikro-orm/core'

import { PaymentEntity } from './entities/payment.entity'
import { PaymentCallbackEnum } from './enum/payment.callback.enum'
import { PaymentStatusEnum } from './enum/payment.status.enum'
import {
  messageFailureCallback,
  messageSuccessCallback,
} from './payment.callback'
import { MessagePaymentCallbackInput } from './types/callback.type'

export async function handleSuccesfulCallbacks(
  payment: PaymentEntity,
  repo: EntityRepository<PaymentEntity>,
): Promise<void> {
  try {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (payment.callback) {
      case PaymentCallbackEnum.MESSAGE: {
        const input = JSON.parse(
          payment.callbackInputJSON,
        ) as MessagePaymentCallbackInput
        messageSuccessCallback(input)
      }
    }
  } catch (e) {
    payment.paymentStatus = PaymentStatusEnum.SUCCESS_CALLBACK_FAILED
    await repo.persistAndFlush(payment)
  }
}

export async function handleFailedCallbacks(
  payment: PaymentEntity,
  repo: EntityRepository<PaymentEntity>,
): Promise<void> {
  try {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (payment.callback) {
      case PaymentCallbackEnum.MESSAGE: {
        const input = JSON.parse(
          payment.callbackInputJSON,
        ) as MessagePaymentCallbackInput
        messageFailureCallback(input)
      }
    }
  } catch (e) {
    payment.paymentStatus = PaymentStatusEnum.FAIL_CALLBACK_FAILED
    await repo.persistAndFlush(payment)
  }
}
