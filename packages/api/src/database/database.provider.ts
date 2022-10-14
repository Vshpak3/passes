import { ConfigService } from '@nestjs/config'

import { ContextName } from './database.decorator'
import { DatabaseService } from './database.service'

export const getDatabaseProviderToken = (contextName: ContextName) =>
  `DatabaseConnectionProvider${contextName}`

export const createDatabaseProvider = (contextName: ContextName) => ({
  provide: getDatabaseProviderToken(contextName),
  useFactory: (configService: ConfigService) => {
    const databaseService = new DatabaseService(configService, contextName)
    return databaseService.knex
  },
  inject: [ConfigService],
})
