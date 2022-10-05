import { Knex } from '@mikro-orm/mysql'

import { OrderEnum } from './dto/page.dto'

const orderToSymbol: Record<OrderEnum, string> = {
  desc: '<=',
  asc: '>=',
}

const strictOrderToSymbol: Record<OrderEnum, string> = {
  desc: '<',
  asc: '>',
}

export function createPaginatedQuery(
  query: Knex.QueryBuilder,
  valueTable: string,
  idTable: string,
  column: string,
  order: OrderEnum,
  value?: string | Date | number,
  lastId?: string,
  otherOrder: any[] = [],
): Knex.QueryBuilder {
  query = query.orderBy([
    ...otherOrder,
    { column: `${valueTable}.${column}`, order },
    { column: `${idTable}.id`, order },
  ])
  if (value) {
    query = query.andWhere(function () {
      let subQuery = this.where(
        `${valueTable}.${column}`,
        orderToSymbol[order],
        value,
      )
      if (lastId) {
        subQuery = subQuery.andWhere(function () {
          return this.where(
            `${valueTable}.${column}`,
            strictOrderToSymbol[order],
            value,
          ).orWhere(`${idTable}.id`, strictOrderToSymbol[order], lastId)
        })
      }
      return subQuery
    })
  }
  return query
}
