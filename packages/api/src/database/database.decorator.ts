import { Inject } from '@nestjs/common'

import { getDatabaseProviderToken } from './database.provider'

export const DB_WRITER = 'ReadWrite'
export const DB_READER = 'ReadOnly'

export const contextNames = [DB_WRITER, DB_READER] as const

export type ContextName = typeof contextNames[number]

export function Database(contextName: ContextName) {
  return Inject(getDatabaseProviderToken(contextName))
}
