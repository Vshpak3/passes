import { ConfigService } from '@nestjs/config'

import { isEnv } from '../util/env'
import { ContextName } from './database.decorator'

export function getDatabaseOptions(
  configService: ConfigService,
  contextName: ContextName,
) {
  const config = {
    database: configService.get('database.dbname'),
    host: configService.get(`database.host${contextName}`),
    port: configService.get('database.port'),
    user: configService.get('database.user'),
    password: configService.get('database.password'),
  }
  const devOverrides =
    isEnv('dev') && contextName === 'ReadOnly'
      ? {
          user: 'reader',
          password: 'reader',
        }
      : {}
  return { ...config, ...devOverrides }
}
