import { Global, Module } from '@nestjs/common'

import { createDatabaseProvider } from './database.provider'
import { DatabaseService } from './database.service'
import { contextNames } from './mikro-orm.options'

const databaseProviders = contextNames.map(createDatabaseProvider)

@Global()
@Module({
  providers: [...databaseProviders, DatabaseService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
