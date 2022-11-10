import { Knex, knex } from '@mikro-orm/mysql'
import { Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ContextName } from './database.decorator'
import { getDatabaseOptions } from './database.options'

@Injectable({ scope: Scope.TRANSIENT })
export class DatabaseService {
  public knex: Knex

  constructor(configService: ConfigService, contextName: ContextName) {
    const dbOptions = getDatabaseOptions(configService, contextName)
    this.knex = knex({
      client: 'mysql2',
      connection: {
        ...dbOptions,
        supportBigNumbers: true,
        bigNumberStrings: false,
        decimalNumbers: true,
        timezone: '+00:00',
        typeCast: (field, next) => {
          if (field.type === 'TINY' && field.length === 1) {
            return field.string() === '1'
          }
          return next()
        },
      },
      pool: {
        min: 2,
        max: 10,
      },
    })
  }
}
