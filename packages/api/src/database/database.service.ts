import { Knex, knex } from '@mikro-orm/mysql'
import { Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ContextName } from './database.decorator'
import { getKnexOptions } from './database.options'

@Injectable({
  scope: Scope.TRANSIENT,
})
export class DatabaseService {
  public knex: Knex

  constructor(configService: ConfigService, contextName: ContextName) {
    this.knex = knex(getKnexOptions(configService, contextName))
  }
}
