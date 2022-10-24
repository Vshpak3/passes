import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { ConfigService } from '@nestjs/config'
import path from 'path'

import { isEnv } from '../util/env'
import { ContextName, DB_WRITER } from './database.decorator'
import { getDatabaseOptions } from './database.options'
import { ColumnNamingStrategy } from './mikro-orm.naming'

export function getMikroOrmOptions(
  configService: ConfigService,
  contextName: ContextName,
): any {
  // Temporary until we upgrade to 5.4.0
  // ): Options<MySqlDriver> | Record<'registerRequestContext', boolean> {
  const dbOptions = getDatabaseOptions(configService, contextName)
  let migrations:
    | { path: string; emit?: 'ts' | 'js'; safe: boolean }
    | undefined
  if (contextName === DB_WRITER) {
    migrations = {
      path: path.join(__dirname, 'migrations'),
      emit: isEnv(configService, 'dev') ? 'ts' : 'js',
      safe: true, // prevents dropping tables and columns
    }
  }

  return {
    metadataProvider: TsMorphMetadataProvider,
    highlighter: new SqlHighlighter(),
    namingStrategy: ColumnNamingStrategy,
    type: 'mysql',
    entities: [path.join(__dirname, '..', '/**/entities/*.js')],
    entitiesTs: [path.join(__dirname, '..', '/**/entities/*.ts')],
    DB_WRITER,
    registerRequestContext: false,
    dbName: dbOptions.database,
    host: dbOptions.host,
    port: dbOptions.port,
    user: dbOptions.user,
    password: dbOptions.password,
    migrations,
    cache: {
      pretty: true,
      options: {
        cacheDir: path.join(__dirname, '.orm-cache'),
      },
    },
  }
}
