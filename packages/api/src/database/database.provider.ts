import { EntityManager } from '@mikro-orm/mysql'

import { ContextName } from './database.decorator'
import { DatabaseService } from './database.service'

export const getDatabaseProviderToken = (contextName: ContextName) =>
  `DatabaseConnectionProvider${contextName}`

export const createDatabaseProvider = (contextName: ContextName) => ({
  provide: getDatabaseProviderToken(contextName),
  useFactory: (entityManager: EntityManager) => {
    const databaseService = new DatabaseService(entityManager)
    return databaseService.knex
  },
  inject: [`${contextName}_EntityManager`],
})
