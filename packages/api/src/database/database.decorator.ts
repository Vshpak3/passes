import { Inject } from '@nestjs/common'

import { getDatabaseProviderToken } from './database.provider'
import { ContextName } from './mikro-orm.options'

export function Database(contextName: ContextName) {
  return Inject(getDatabaseProviderToken(contextName))
}
