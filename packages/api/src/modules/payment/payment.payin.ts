import { DatabaseService } from '../../database/database.service'
import { PayinEntity } from './entities/payin.entity'
import { PayinStatusEnum } from './enum/payin.status.enum'
import { functionMapping } from './payin.callback'
import { PaymentService } from './payment.service'

async function handleCallback(
  payin,
  payService: PaymentService,
  db: DatabaseService['knex'],
  failedCallbackStatus: PayinStatusEnum,
  selector: string,
): Promise<void> {
  try {
    const func = functionMapping(payin.callback)[selector]
    type params = Parameters<typeof func>

    const output = await func(
      payin,
      payin.callback_input_json as params[0],
      payService,
      db,
    )
    if (output) {
      await db(PayinEntity.table)
        .update({
          callbackOutputJSON: JSON.stringify(output),
        })
        .where({ id: payin.id })
    }
  } catch (err) {
    await db(PayinEntity.table)
      .update({
        payinStatus: failedCallbackStatus,
      })
      .where({ id: payin.id })

    throw err
  }
}

export const handleSuccesfulCallback = async (
  payin,
  payService: PaymentService,
  db: DatabaseService['knex'],
) => {
  await handleCallback(
    payin,
    payService,
    db,
    PayinStatusEnum.SUCCESS_CALLBACK_FAILED,
    'success',
  )
}

export const handleFailedCallback = async (
  payin,
  payService: PaymentService,
  db: DatabaseService['knex'],
) => {
  await handleCallback(
    payin,
    payService,
    db,
    PayinStatusEnum.FAIL_CALLBACK_FAILED,
    'failure',
  )
}

export const handleCreationCallback = async (
  payin,
  payService: PaymentService,
  db: DatabaseService['knex'],
) => {
  await handleCallback(
    payin,
    payService,
    db,
    PayinStatusEnum.CREATE_CALLBACK_FAILED,
    'creation',
  )
}
