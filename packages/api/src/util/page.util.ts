import { Knex } from '@mikro-orm/mysql'
import { OrderEnum } from 'aws-sdk/clients/codecommit'

import { orderToSymbol, strictOrderToSymbol } from './dto/page.dto'

export function createPaginatedQuery(
  query: Knex.QueryBuilder,
  table: string,
  column: string,
  order: OrderEnum,
  value?: string | Date | number,
  lastId?: string,
): Knex.QueryBuilder {
  query = query.orderBy([
    { column: `${table}.${column}`, order },
    { column: `${table}.id`, order },
  ])
  if (value) {
    query = query.andWhere(function () {
      let subQuery = this.where(
        `${table}.${column}`,
        orderToSymbol[order],
        value,
      )
      if (lastId) {
        subQuery = subQuery.andWhere(function () {
          return this.where(
            `${table}.${column}`,
            strictOrderToSymbol[order],
            value,
          ).orWhere(`${table}.id`, strictOrderToSymbol[order], lastId)
        })
      }
      return subQuery
    })
  }
  return query
}
