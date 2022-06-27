import type { Options } from '@mikro-orm/core'
import type { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import path from 'path'

const options: Options<PostgreSqlDriver> = {
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  type: 'postgresql',
  entities: [path.join(__dirname, '..', '/**/entities/*.js')],
  entitiesTs: [path.join(__dirname, '..', '/**/entities/*.ts')],
  dbName: 'moment',
  // host: 'root',
  port: 5432,
  user: 'root',
  password: 'root',
  migrations: {
    path: path.join(__dirname, 'migrations'),
  },
  cache: {
    pretty: true,
    options: {
      cacheDir: path.join(__dirname, '.orm-cache'),
    },
  },
}

export default options
