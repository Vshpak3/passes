import { Knex } from '@mikro-orm/mysql'

import { createPaginatedQuery } from '../../util/page.util'
import { UserSpendingEntity } from '../creator-stats/entities/user-spending.entity'
import { SearchFollowRequestDto } from '../follow/dto/search-follow.dto'
import { UserEntity } from '../user/entities/user.entity'
import { GetListMembersRequestDto } from './dto/get-list-members.dto'
import { ListMemberOrderTypeEnum } from './enum/list-member.order.enum'

export function createGetMemberQuery(
  query: Knex.QueryBuilder,
  getListMembersRequestDto: GetListMembersRequestDto | SearchFollowRequestDto,
  memberTable: string,
): Knex.QueryBuilder {
  const {
    username,
    displayName,
    orderType,
    createdAt,
    order,
    search,
    lastId,
    metadataNumber,
    amount,
  } = getListMembersRequestDto
  switch (orderType) {
    case ListMemberOrderTypeEnum.CREATED_AT:
      query = createPaginatedQuery(
        query,
        memberTable,
        memberTable,
        'created_at',
        order,
        createdAt,
        lastId,
      )
      break
    case ListMemberOrderTypeEnum.USERNAME:
      query = createPaginatedQuery(
        query,
        UserEntity.table,
        memberTable,
        'username',
        order,
        username,
        lastId,
      )
      break
    case ListMemberOrderTypeEnum.DISPLAY_NAME:
      query = createPaginatedQuery(
        query,
        UserEntity.table,
        memberTable,
        'display_name',
        order,
        displayName,
        lastId,
      )
      break
    case ListMemberOrderTypeEnum.METADATA:
      query = createPaginatedQuery(
        query,
        memberTable,
        memberTable,
        'meta_number',
        order,
        metadataNumber,
        lastId,
      )
      break
    case ListMemberOrderTypeEnum.SPENT:
      query = createPaginatedQuery(
        query,
        UserSpendingEntity.table,
        memberTable,
        'spent',
        order,
        amount,
        lastId,
      )
      break
  }

  if (search && search.length) {
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
