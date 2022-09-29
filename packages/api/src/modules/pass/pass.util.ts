import { Knex } from '@mikro-orm/mysql'

import { orderToSymbol } from '../../util/dto/page.dto'
import { ListMemberOrderTypeEnum } from '../list/enum/list-member.order.enum'
import { UserEntity } from '../user/entities/user.entity'
import { GetPassHoldersRequestDto } from './dto/get-pass-holders.dto'
import { GetPassHoldingsRequestDto } from './dto/get-pass-holdings.dto'
import { PassEntity } from './entities/pass.entity'
import { PassHolderEntity } from './entities/pass-holder.entity'
import { MAX_PASSHOLDERS_PER_REQUEST } from './pass.service'

export function createPassHolderQuery(
  query: Knex.QueryBuilder,
  requestDto: GetPassHoldersRequestDto | GetPassHoldingsRequestDto,
): Knex.QueryBuilder {
  const { username, displayName, orderType, createdAt, order, search } =
    requestDto
  switch (orderType) {
    case ListMemberOrderTypeEnum.CREATED_AT:
      query = query.orderBy([
        { column: `${PassHolderEntity.table}.created_at`, order },
        { column: `${PassHolderEntity.table}.id`, order },
      ])
      if (createdAt) {
        query = query.andWhere(
          `${PassHolderEntity.table}.created_at`,
          orderToSymbol[order],
          createdAt,
        )
      }
      break
    case ListMemberOrderTypeEnum.USERNAME:
      query = query.orderBy([
        { column: `${UserEntity.table}.username`, order },
        { column: `${PassHolderEntity.table}.id`, order },
      ])
      if (username) {
        query = query.andWhere(
          `${UserEntity.table}.username`,
          orderToSymbol[order],
          username,
        )
      }
      break
    case ListMemberOrderTypeEnum.DISPLAY_NAME:
      query = query.orderBy([
        { column: `${UserEntity.table}.display_name`, order },
        { column: `${PassHolderEntity.table}.id`, order },
      ])
      if (displayName) {
        query = query.andWhere(
          `${UserEntity.table}.display_name`,
          orderToSymbol[order],
          displayName,
        )
      }
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
