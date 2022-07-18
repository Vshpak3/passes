import type { Options } from '@mikro-orm/core'
import type { MySqlDriver } from '@mikro-orm/mysql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { ConfigService } from '@nestjs/config'
import path from 'path'

export function getDatabaseOptions(
  configService: ConfigService,
): Options<MySqlDriver> {
  return {
    metadataProvider: TsMorphMetadataProvider,
    highlighter: new SqlHighlighter(),
    type: 'mysql',
    entities: [path.join(__dirname, '..', '/**/entities/*.js')],
    entitiesTs: [path.join(__dirname, '..', '/**/entities/*.ts')],
    dbName: configService.get('database.dbname'),
    host: configService.get('database.host'),
    port: configService.get('database.port'),
    user: configService.get('database.user'),
    password: configService.get('database.password'),
    // safe: false, // prevents dropping tables and columns <-- TODO: turn on soon
    migrations: {
      path: path.join(__dirname, 'migrations'),
    },
    cache: {
      pretty: true,
      options: {
        cacheDir: path.join(__dirname, '.orm-cache'),
      },
    },
    debug: process.env.NODE_ENV === 'dev',
  }
}

export const databaseOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<Options<MySqlDriver>> => getDatabaseOptions(configService),
  inject: [ConfigService],
}
