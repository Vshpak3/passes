import type { Options } from '@mikro-orm/core'
import type { MySqlDriver } from '@mikro-orm/mysql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { ConfigService } from '@nestjs/config'
import path from 'path'

export const contextNames = ['ReadWrite', 'ReadOnly'] as const
export type ContextName = typeof contextNames[number]

export function getDatabaseOptions(
  configService: ConfigService,
  contextName: ContextName,
): Options<MySqlDriver> | Record<'registerRequestContext', boolean> {
  let migrations: { path: string } | undefined
  if (contextName === 'ReadWrite')
    migrations = {
      path: path.join(__dirname, 'migrations'),
    }

  const hosts = configService.get('database.hosts')
  return {
    metadataProvider: TsMorphMetadataProvider,
    highlighter: new SqlHighlighter(),
    type: 'mysql',
    entities: [path.join(__dirname, '..', '/**/entities/*.js')],
    entitiesTs: [path.join(__dirname, '..', '/**/entities/*.ts')],
    dbName: configService.get('database.dbname'),
    contextName,
    allowGlobalContext: true, // TODO: remove after migrating code to knex setup
    registerRequestContext: false,
    host: hosts[contextName],
    port: configService.get('database.port'),
    user: configService.get('database.user'),
    password: configService.get('database.password'),
    // safe: false, // prevents dropping tables and columns <-- TODO: turn on soon
    migrations,
    cache: {
      pretty: true,
      options: {
        cacheDir: path.join(__dirname, '.orm-cache'),
      },
    },
    debug: process.env.NODE_ENV === 'dev',
  }
}
