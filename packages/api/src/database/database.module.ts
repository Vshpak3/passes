import { Global, Module } from '@nestjs/common'

import { createDatabaseProvider } from './database.provider'
import { contextNames } from './mikro-orm.options'

const databaseProviders = contextNames.map(createDatabaseProvider)

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
