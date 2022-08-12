import { jest } from '@jest/globals'
import { EntityRepository } from '@mikro-orm/core'

import { getDatabaseProviderToken } from './database.provider'
import { DatabaseService } from './database.service'
import { contextNames } from './mikro-orm.options'

export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const repositoryMockFactory: () => MockType<EntityRepository<any>> =
  jest.fn(() => ({
    findOne: jest.fn((entity) => entity),
    findAndCount: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  }))

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const databaseServiceMockFactory: () => MockType<DatabaseService> =
  jest.fn(() => ({
    knex: jest.fn((entity) => entity),
    v4: jest.fn((entity) => entity),
    init: jest.fn((entity) => entity),
  }))

export const mockDatabaseService = contextNames.map((contextName) => ({
  provide: getDatabaseProviderToken(contextName),
  useFactory: databaseServiceMockFactory,
}))
