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
  // Temporary use any instead of this return due to bug in 5.3.1
  // Options<MySqlDriver> | Record<'registerRequestContext', boolean> {
  const env = configService.get('infra.env')
  let migrations: { path: string; emit?: 'ts' | 'js' } | undefined
  if (contextName === 'ReadWrite')
    migrations = {
      path: path.join(__dirname, 'migrations'),
      emit: env === 'dev' ? 'ts' : 'js',
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
    debug: env === 'dev',
  }
}
