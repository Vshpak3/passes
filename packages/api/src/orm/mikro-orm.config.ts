import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';

function ormPath(name: string): string {
  return path.join(__dirname, name);
}

const options: Options<PostgreSqlDriver> = {
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  type: 'postgresql',
  entities: ['./dist/**/entities/*.js'],
  entitiesTs: ['./src/**/entities/*.ts'],
  dbName: 'moment',
  // host: "root",
  port: 5432,
  user: 'root',
  password: 'root',
  migrations: {
    path: ormPath('migrations'),
  },
  cache: {
    pretty: true,
    options: {
      cacheDir: ormPath('.orm-cache'),
    },
  },
};

export default options;
