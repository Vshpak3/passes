import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { ConfigService } from '@nestjs/config'
import path from 'path'

export const contextNames = ['ReadWrite', 'ReadOnly'] as const
export type ContextName = typeof contextNames[number]

export function getMikroOrmOptions(
  configService: ConfigService,
  contextName: ContextName,
): any {
  // Temporary until we upgrade to 5.4.0
  // ): Options<MySqlDriver> | Record<'registerRequestContext', boolean> {
  const env = configService.get('infra.env')
  let migrations: { path: string; emit?: 'ts' | 'js' } | undefined
  if (contextName === 'ReadWrite') {
    migrations = {
      path: path.join(__dirname, 'migrations'),
      emit: env === 'dev' ? 'ts' : 'js',
    }
  }

  return {
    metadataProvider: TsMorphMetadataProvider,
    highlighter: new SqlHighlighter(),
    type: 'mysql',
    entities: [path.join(__dirname, '..', '/**/entities/*.js')],
    entitiesTs: [path.join(__dirname, '..', '/**/entities/*.ts')],
    contextName,
    registerRequestContext: false,
    dbName: configService.get('database.dbname'),
    host: configService.get('database.hosts')[contextName],
    port: configService.get('database.port'),
    user: configService.get('database.user'),
    password: configService.get('database.password'),
    safe: true, // prevents dropping tables and columns
    migrations,
    cache: {
      pretty: true,
      options: {
        cacheDir: path.join(__dirname, '.orm-cache'),
      },
    },
  }
}
