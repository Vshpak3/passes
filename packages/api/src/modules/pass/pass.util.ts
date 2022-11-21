import { Knex } from '@mikro-orm/mysql'

import { createPaginatedQuery } from '../../util/page.util'
import { UserSpendingEntity } from '../creator-stats/entities/user-spending.entity'
import { UserEntity } from '../user/entities/user.entity'
import { GetPassHoldersRequestDto } from './dto/get-pass-holders.dto'
import { PassEntity } from './entities/pass.entity'
import { PassHolderEntity } from './entities/pass-holder.entity'
import { PassHolderOrderTypeEnum } from './enum/pass-holder.order.enum'
import { MAX_PASSHOLDERS_PER_REQUEST } from './pass.service'

export function createPassHolderQuery(
  query: Knex.QueryBuilder,
  requestDto: GetPassHoldersRequestDto,
): Knex.QueryBuilder {
  const {
    username,
    displayName,
    orderType,
    createdAt,
    order,
    search,
    lastId,
    spent,
  } = requestDto
  switch (orderType) {
    case PassHolderOrderTypeEnum.CREATED_AT:
      query = createPaginatedQuery(
        query,
        PassHolderEntity.table,
        PassHolderEntity.table,
        'created_at',
        order,
        createdAt,
        lastId,
      )
      break
    case PassHolderOrderTypeEnum.USERNAME:
      query = createPaginatedQuery(
        query,
        UserEntity.table,
        PassHolderEntity.table,
        'username',
        order,
        username,
        lastId,
      )
      break
    case PassHolderOrderTypeEnum.DISPLAY_NAME:
      query = createPaginatedQuery(
        query,
        UserEntity.table,
        PassHolderEntity.table,
        'display_name',
        order,
        displayName,
        lastId,
      )
      break
    case PassHolderOrderTypeEnum.SPENT:
      query = createPaginatedQuery(
        query,
        UserSpendingEntity.table,
        PassHolderEntity.table,
        'amount',
        order,
        spent,
        lastId,
      )
      break
  }

  if (search && search.length) {
    // const strippedSearch = search.replace(/\W/g, '')
    const likeClause = `%${search}%`
    query = query.andWhere(function () {
      return this.whereILike(`${UserEntity.table}.username`, likeClause)
        .orWhereILike(`${UserEntity.table}.display_name`, likeClause)
        .orWhereILike(`${PassEntity.table}.title`, likeClause)
        .orWhereILike(`${PassEntity.table}.description`, likeClause)
    })
  }
  return query.limit(MAX_PASSHOLDERS_PER_REQUEST)
}
