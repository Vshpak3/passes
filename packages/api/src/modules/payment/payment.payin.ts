import { DatabaseService } from '../../database/database.service'
import { PayinEntity } from './entities/payin.entity'
import { PayinStatusEnum } from './enum/payin.status.enum'
import { functionMapping } from './payin.callback'
import { PaymentService } from './payment.service'

export async function handleSuccesfulCallbacks(
  payin,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  try {
    const func = functionMapping(payin.callback).success
    type params = Parameters<typeof func>
    await func(payin.id, payin.callback_input_json as params[0], payService, db)
  } catch (e) {
    await db
      .table(PayinEntity.table)
      .update(
        PayinEntity.toDict<PayinEntity>({
          payinStatus: PayinStatusEnum.SUCCESS_CALLBACK_FAILED,
        }),
      )
      .where('id', payin.id)

    throw e
  }
}

export async function handleFailedCallbacks(
  payin,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  try {
    const func = functionMapping(payin.callback).failure
    type params = Parameters<typeof func>
    await func(payin.id, payin.callback_input_json as params[0], payService, db)
  } catch (e) {
    await db
      .table(PayinEntity.table)
      .update(
        PayinEntity.toDict<PayinEntity>({
          payinStatus: PayinStatusEnum.FAIL_CALLBACK_FAILED,
        }),
      )
      .where('id', payin.id)

    throw e
  }
}

export async function handleCreationCallback(
  payin,
  payService: PaymentService,
  db: DatabaseService['knex'],
): Promise<void> {
  try {
    const func = functionMapping(payin.callback).creation
    type params = Parameters<typeof func>
    await func(payin.id, payin.callback_input_json as params[0], payService, db)
  } catch (e) {
    await db
      .table(PayinEntity.table)
      .update(
        PayinEntity.toDict<PayinEntity>({
          payinStatus: PayinStatusEnum.CREATE_CALLBACK_FAILED,
        }),
      )
      .where('id', payin.id)

    throw e
  }
}
