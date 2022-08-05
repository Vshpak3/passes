import { EntityManager } from '@mikro-orm/mysql'

import { DatabaseService } from './database.service'
import { ContextName } from './mikro-orm.options'

export const getDatabaseProviderToken = (contextName: ContextName) =>
  `DatabaseConnectionProvider${contextName}`

export const createDatabaseProvider = (contextName: ContextName) => ({
  provide: getDatabaseProviderToken(contextName),
  useFactory: async (
    entityManager: EntityManager,
    databaseService: DatabaseService,
  ) => {
    databaseService.init(entityManager)
    return databaseService
  },
  inject: [`${contextName}_EntityManager`, DatabaseService],
})
