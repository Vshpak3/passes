import { DatabaseService } from '../../database/database.service'
import { PayinEntity } from './entities/payin.entity'
import { PayinStatusEnum } from './enum/payin.status.enum'
import { functionMapping } from './payment.callback'

export async function handleSuccesfulCallbacks(
  payin,
  db: DatabaseService['knex'],
): Promise<void> {
  try {
    const func = functionMapping(payin.callback).success
    type params = Parameters<typeof func>
    await func(payin.callback_input_json as params[0])
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
  db: DatabaseService['knex'],
): Promise<void> {
  try {
    const func = functionMapping(payin.callback).failure
    type params = Parameters<typeof func>
    await func(payin.callback_input_json as params[0])
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
  db: DatabaseService['knex'],
): Promise<void> {
  try {
    const func = functionMapping(payin.callback).creation
    type params = Parameters<typeof func>
    await func(payin.callback_input_json as params[0])
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
