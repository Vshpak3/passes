import { InternalServerErrorException } from '@nestjs/common'

import { DatabaseService } from '../../database/database.service'
import { PayinEntity } from './entities/payin.entity'
import { PayinStatusEnum } from './enum/payin.status.enum'
import { functionMapping } from './payin.callback'
import { PaymentService } from './payment.service'

async function handleCallback(
  payin: PayinEntity,
  payService: PaymentService,
  db: DatabaseService['knex'],
  successfulCallbackStatus: PayinStatusEnum,
  failedCallbackStatus: PayinStatusEnum,
  selector: string,
): Promise<void> {
  if (!payin) {
    throw new InternalServerErrorException('Payin not found during callback')
  }
  try {
    const func = functionMapping(payin.callback)[selector]
    type params = Parameters<typeof func>

    const output = await func(
      payin,
      payin.callback_input_json as params[0],
      payService,
      db,
    )
    await db<PayinEntity>(PayinEntity.table)
      .update({
        payin_status: successfulCallbackStatus,
        callback_output_json: output ? JSON.stringify(output) : '',
      })
      .where({ id: payin.id })
  } catch (err) {
    await db<PayinEntity>(PayinEntity.table)
      .update({
        payin_status: failedCallbackStatus,
      })
      .where({ id: payin.id })

    throw err
  }
}

export const handleSuccesfulCallback = async (
  payin: PayinEntity,
  payService: PaymentService,
  db: DatabaseService['knex'],
) => {
  await handleCallback(
    payin,
    payService,
    db,
    PayinStatusEnum.SUCCESSFUL,
    PayinStatusEnum.SUCCESS_CALLBACK_FAILED,
    'success',
  )
}

export const handleFailedCallback = async (
  payin: PayinEntity,
  payService: PaymentService,
  db: DatabaseService['knex'],
) => {
  await handleCallback(
    payin,
    payService,
    db,
    PayinStatusEnum.FAILED,
    PayinStatusEnum.FAIL_CALLBACK_FAILED,
    'failure',
  )
}

export const handleUncreateCallback = async (
  payin: PayinEntity,
  payService: PaymentService,
  db: DatabaseService['knex'],
) => {
  await handleCallback(
    payin,
    payService,
    db,
    PayinStatusEnum.UNCREATED,
    PayinStatusEnum.FAIL_CALLBACK_FAILED,
    'failure',
  )
}

export const handleCreationCallback = async (
  payin: PayinEntity,
  payService: PaymentService,
  db: DatabaseService['knex'],
) => {
  await handleCallback(
    payin,
    payService,
    db,
    PayinStatusEnum.CREATED,
    PayinStatusEnum.CREATE_CALLBACK_FAILED,
    'creation',
  )
}
