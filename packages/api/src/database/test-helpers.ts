import { jest } from '@jest/globals'

import { contextNames } from './database.decorator'
import { getDatabaseProviderToken } from './database.provider'
import { DatabaseService } from './database.service'

export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<() => void>
}

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
