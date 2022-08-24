import { Global, Module, OnModuleInit } from '@nestjs/common'

import { Database } from './database.decorator'
import { createDatabaseProvider } from './database.provider'
import { DatabaseService } from './database.service'
import { contextNames } from './mikro-orm.options'

const databaseProviders = contextNames.map(createDatabaseProvider)

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @Database('ReadWrite')
    private readonly db: DatabaseService['knex'],
  ) {}

  async onModuleInit() {
    try {
      // test query to check if successfully connected to database
      await this.db.raw('SELECT 1')
    } catch (error) {
      throw new Error('Database connection error: ' + error)
    }
  }
}
