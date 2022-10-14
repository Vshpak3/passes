import { ConfigService } from '@nestjs/config'

import { ContextName } from './database.decorator'

export function getDatabaseOptions(
  configService: ConfigService,
  contextName: ContextName,
) {
  return {
    database: configService.get('database.dbname'),
    host: configService.get(`database.host${contextName}`),
    port: configService.get('database.port'),
    user: configService.get('database.user'),
    password: configService.get('database.password'),
  }
}
