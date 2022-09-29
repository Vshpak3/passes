import { EntityManager, Knex, knex } from '@mikro-orm/mysql'
import { Injectable, Scope } from '@nestjs/common'

import { getKnexOptions } from './database.options'

@Injectable({
  scope: Scope.TRANSIENT,
})
export class DatabaseService {
  public knex: Knex

  constructor(entityManager: EntityManager) {
    this.knex = knex(getKnexOptions(entityManager.getKnex()))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    Object.values(entityManager.metadata.getAll()).forEach(
      ({ class: entityClass, tableName }) => {
        if (entityClass) {
          entityClass.table = tableName
        }
      },
    )
  }
}
