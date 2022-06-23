import { Entity, EntityRepository } from '@mikro-orm/core'
import { jest } from '@jest/globals'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>
}

// @ts-ignore
export const repositoryMockFactory: () => MockType<EntityRepository<any>> =
  jest.fn(() => ({
    findOne: jest.fn((entity) => entity),
    findAndCount: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  }))
