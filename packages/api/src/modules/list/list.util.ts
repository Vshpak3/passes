import { Knex } from '@mikro-orm/mysql'

import { orderToSymbol } from '../../util/dto/page.dto'
import { SearchFollowRequestDto } from '../follow/dto/search-follow.dto'
import { UserEntity } from '../user/entities/user.entity'
import { GetListMembersRequestDto } from './dto/get-list-members.dto'
import { ListMemberOrderTypeEnum } from './enum/list-member.order.enum'

export function createGetMemberQuery(
  query: Knex.QueryBuilder,
  getListMembersRequestDto: GetListMembersRequestDto | SearchFollowRequestDto,
  memberTable: string,
): Knex.QueryBuilder {
  const { username, displayName, orderType, createdAt, order, search } =
    getListMembersRequestDto
  switch (orderType) {
    case ListMemberOrderTypeEnum.CREATED_AT:
      query = query.orderBy([
        { column: `${memberTable}.created_at`, order },
        { column: `${memberTable}.id`, order },
      ])
      if (createdAt) {
        query = query.andWhere(
          `${memberTable}.created_at`,
          orderToSymbol[order],
          createdAt,
        )
      }
      break
    case ListMemberOrderTypeEnum.USERNAME:
      query = query.orderBy([
        { column: `${UserEntity.table}.username`, order },
        { column: `${memberTable}.id`, order },
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
        { column: `${memberTable}.id`, order },
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

  if (search) {
    // const strippedSearch = search.replace(/\W/g, '')
    const likeClause = `%${search}%`
    query = query.andWhere(function () {
      return this.whereILike(
        `${UserEntity.table}.username`,
        likeClause,
      ).orWhereILike(`${UserEntity.table}.display_name`, likeClause)
    })
  }
  return query
}
