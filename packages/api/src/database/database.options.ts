import type { Knex } from '@mikro-orm/mysql'
import { ConfigService } from '@nestjs/config'

import { ContextName } from './database.decorator'

export function getDatabaseOptions(
  configService: ConfigService,
  contextName: ContextName,
) {
  return {
    client: 'mysql2',
    database: configService.get('database.dbname'),
    host: configService.get(`database.host${contextName}`),
    port: configService.get('database.port'),
    user: configService.get('database.user'),
    password: configService.get('database.password'),
  }
}

export function getKnexOptions(
  configService: ConfigService,
  contextName: ContextName,
): Knex.Config<any> {
  const dbOptions = getDatabaseOptions(configService, contextName)
  return {
    client: dbOptions.client,
    connection: {
      database: dbOptions.database,
      host: dbOptions.host,
      port: dbOptions.port,
      user: dbOptions.user,
      password: dbOptions.password,
      supportBigNumbers: true,
      bigNumberStrings: false,
      decimalNumbers: true,
      timezone: '+00:00',
    },
  }
}
