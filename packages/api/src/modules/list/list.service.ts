import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createPaginatedQuery } from '../../util/page.util'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { UserSpendingEntity } from '../creator-stats/entities/user-spending.entity'
import { FollowEntity } from '../follow/entities/follow.entity'
import { FollowService } from '../follow/follow.service'
import { UserEntity } from '../user/entities/user.entity'
import { AddListMembersRequestDto } from './dto/add-list-members.dto'
import { CreateListRequestDto } from './dto/create-list.dto'
import { EditListNameRequestDto } from './dto/edit-list-name.dto'
import { GetListMembersRequestDto } from './dto/get-list-members.dto'
import { GetListsRequestsDto } from './dto/get-lists.dto'
import { ListDto } from './dto/list.dto'
import { ListMemberDto } from './dto/list-member.dto'
import { RemoveListMembersRequestDto } from './dto/remove-list-members.dto'
import { ListEntity } from './entities/list.entity'
import { ListMemberEntity } from './entities/list-member.entity'
import { ListOrderTypeEnum } from './enum/list.order.enum'
import { ListTypeEnum } from './enum/list.type.enum'
import { ListMemberOrderTypeEnum } from './enum/list-member.order.enum'
import {
  IncorrectListTypeError,
  ListLimitReachedError,
  NoListError,
} from './error/list.error'
import { createGetMemberQuery } from './list.util'

export const USER_LIST_LIMIT = 1000
export const MAX_LISTS_PER_REQUEST = 10
export const MAX_LIST_MEMBERS_PER_REQUEST = 20

export const NUMBER_OF_TOP_SPENDERS = 50
@Injectable()
export class ListService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    private readonly followService: FollowService,
  ) {}

  async createList(
    userId: string,
    createListDto: CreateListRequestDto,
  ): Promise<void> {
    const count = await this.dbReader<ListEntity>(ListEntity.table)
      .where({ user_id: userId })
      .count()
    if (count[0]['count(*)'] >= USER_LIST_LIMIT) {
      throw new ListLimitReachedError('list limit reached')
    }

    const listId = uuid.v4()
    let listMemberRecords: Partial<ListMemberEntity>[] = []

    const followers = await this.dbReader<FollowEntity>(FollowEntity.table)
      .where({ creator_id: userId })
      .whereIn('follower_id', createListDto.userIds)
      .select('follower_id')

    listMemberRecords = followers.map((follower) => {
      return {
        list_id: listId,
        user_id: follower.follower_id,
      }
    })

    await this.dbWriter.transaction(async (trx) => {
      await trx<ListEntity>(ListEntity.table).insert({
        id: listId,
        user_id: userId,
        name: createListDto.name,
      })
      if (listMemberRecords.length !== 0) {
        await trx<ListMemberEntity>(ListMemberEntity.table)
          .insert(listMemberRecords)
          .onConflict(['list_id', 'user_id'])
          .ignore()
      }
    })
    await this.updateCount(listId)
  }

  async deleteList(userId: string, id: string): Promise<boolean> {
    const dbResult = await this.dbWriter<ListEntity>(ListEntity.table)
      .where({
        id,
        user_id: userId,
        type: ListTypeEnum.NORMAL,
        deleted_at: null,
      })
      .update({ deleted_at: new Date() })
    return dbResult === 1
  }

  async fillAutomatedLists(lists: any[]) {
    await Promise.all(
      lists.map(async (list) => {
        switch (list.type) {
          case ListTypeEnum.FOLLOWERS:
            list.count = (
              await this.dbReader<CreatorStatEntity>(CreatorStatEntity.table)
                .where({ user_id: list.user_id })
                .select('num_followers')
                .first()
            )?.num_followers
            break
          case ListTypeEnum.FOLLOWING:
            list.count = (
              await this.dbReader<UserEntity>(UserEntity.table)
                .where({ id: list.user_id })
                .select('num_following')
                .first()
            )?.num_following
            break
          default:
            break
        }
      }),
    )
  }

  async getList(userId: string, listId: string): Promise<ListDto> {
    const list = await this.dbReader<ListEntity>(ListEntity.table)
      .where({ id: listId, user_id: userId, deleted_at: null })
      .select('*')
      .first()
    if (list) {
      await this.fillAutomatedLists([list])
    }
    return new ListDto(list)
  }

  async getListsForUser(
    userId: string,
    getListsRequestsDto: GetListsRequestsDto,
  ): Promise<ListDto[]> {
    const { name, lastId, createdAt, updatedAt, order, orderType, search } =
      getListsRequestsDto
    let query = this.dbReader<ListEntity>(ListEntity.table)
      .andWhere({ user_id: userId, deleted_at: null })
      .select('*')
    let column = ''
    let value: string | Date | undefined = undefined
    switch (orderType) {
      case ListOrderTypeEnum.CREATED_AT:
        column = 'created_at'
        value = createdAt
        break
      case ListOrderTypeEnum.UPDATED_AT:
        column = 'updated_at'
        value = updatedAt
        break
      case ListOrderTypeEnum.NAME:
        column = 'name'
        value = name
        break
    }

    query = createPaginatedQuery(
      query,
      ListEntity.table,
      ListEntity.table,
      column,
      order,
      value,
      lastId,
    )
    if (search && search.length) {
      // const strippedSearch = search.replace(/\W/g, '')
      const likeClause = `%${search}%`
      query = query.andWhereILike(`${ListEntity.table}.name`, likeClause)
    }

    const lists = await query.limit(MAX_LISTS_PER_REQUEST)
    await this.fillAutomatedLists(lists)
    return lists.map((list) => new ListDto(list))
  }

  async getListMembers(
    userId: string,
    getListMembersRequestDto: GetListMembersRequestDto,
  ) {
    const { listId } = getListMembersRequestDto
    const type = await this.checkList(userId, listId, false)
    if (
      getListMembersRequestDto.orderType === ListMemberOrderTypeEnum.METADATA &&
      type !== ListTypeEnum.TOP_SPENDERS
    ) {
      throw new BadRequestException('invalid order type for list')
    }
    switch (type) {
      case ListTypeEnum.FOLLOWERS:
        return await this.followService.searchFansByQuery(
          userId,
          getListMembersRequestDto,
        )
      case ListTypeEnum.FOLLOWING:
        return await this.followService.searchFollowingByQuery(
          userId,
          getListMembersRequestDto,
        )
      default:
        return await this.getNormalListMembers(userId, getListMembersRequestDto)
    }
  }

  async getNormalListMembers(
    userId: string,
    getListMembersRequestDto: GetListMembersRequestDto,
  ) {
    const result = await createGetMemberQuery(
      this.dbReader<ListMemberEntity>(ListMemberEntity.table)
        .leftJoin(
          UserEntity.table,
          `${ListMemberEntity.table}.user_id`,
          `${UserEntity.table}.id`,
        )
        .select([
          `${UserEntity.table}.id as user_id`,
          `${UserEntity.table}.username`,
          `${UserEntity.table}.display_name`,
          `${ListMemberEntity.table}.id`,
          `${ListMemberEntity.table}.created_at`,
        ])
        .where(
          `${ListMemberEntity.table}.list_id`,
          getListMembersRequestDto.listId,
        ),
      getListMembersRequestDto,
      ListMemberEntity.table,
    ).limit(MAX_LIST_MEMBERS_PER_REQUEST)

    return result.map((follow) => {
      return new ListMemberDto(follow)
    })
  }

  async checkList(
    userId: string,
    listId: string,
    manual: boolean,
  ): Promise<ListTypeEnum> {
    const list = await this.dbReader<ListEntity>(ListEntity.table)
      .where({
        user_id: userId,
        id: listId,
      })
      .select('type')
      .first()
    if (!list) {
      throw new NoListError('list not found')
    }
    if (manual && list.type !== ListTypeEnum.NORMAL) {
      throw new IncorrectListTypeError('can not manually alter this list')
    }
    return list.type
  }

  async updateCount(listId: string) {
    await this.dbWriter<ListEntity>(ListEntity.table)
      .where({ id: listId })
      .update(
        'count',
        this.dbWriter<ListMemberEntity>(ListMemberEntity.table)
          .where({ list_id: listId })
          .count(),
      )
  }

  async addListMembers(
    userId: string,
    addListMembersDto: AddListMembersRequestDto,
    manual: boolean,
  ): Promise<void> {
    await this.checkList(userId, addListMembersDto.listId, manual)

    const followers = await this.dbReader<FollowEntity>(FollowEntity.table)
      .select('follower_id')
      .where({ creator_id: userId })
      .whereIn('follower_id', addListMembersDto.userIds)

    if (followers.length) {
      await this.dbWriter<ListMemberEntity>(ListMemberEntity.table)
        .insert(
          followers.map(function (follower) {
            return {
              list_id: addListMembersDto.listId,
              user_id: follower.follower_id,
            }
          }),
        )
        .onConflict(['list_id', 'user_id'])
        .ignore()
    }
    await this.updateCount(addListMembersDto.listId)
  }

  async removeListMembers(
    userId: string,
    removeListMembersDto: RemoveListMembersRequestDto,
    manual: true,
  ): Promise<boolean> {
    await this.checkList(userId, removeListMembersDto.listId, manual)

    const updated = await this.dbWriter<ListMemberEntity>(
      ListMemberEntity.table,
    )
      .where({ list_id: removeListMembersDto.listId })
      .whereIn('user_id', removeListMembersDto.userIds)
      .delete()
    await this.updateCount(removeListMembersDto.listId)
    return updated === 1
  }

  async editListName(
    userId: string,
    editListNameRequestDto: EditListNameRequestDto,
  ): Promise<boolean> {
    const { listId, name } = editListNameRequestDto
    const updated = await this.dbWriter<ListEntity>(ListEntity.table)
      .where({
        id: listId,
        user_id: userId,
        type: ListTypeEnum.NORMAL,
        deleted_at: null,
      })
      .update({
        name,
      })
    return updated === 1
  }

  async validateListIds(userId: string, listIds: string[]) {
    const filteredLists = await this.dbReader<ListEntity>(ListEntity.table)
      .whereIn('id', listIds)
      .andWhere({ user_id: userId })
      .select('id')

    const filteredListsIds = new Set(filteredLists.map((list) => list.id))
    listIds.forEach((listId) => {
      if (!filteredListsIds.has(listId)) {
        throw new NoListError('cant find list for user')
      }
    })
  }

  async getAllListMembers(userId: string, listIds: string[]) {
    await this.validateListIds(userId, listIds)
    const followers = await this.dbReader<FollowEntity>(FollowEntity.table)
      .where({ creator_id: userId })
      .select('follower_id')
    const userIdsSet = new Set(
      (
        await this.dbReader<ListMemberEntity>(ListMemberEntity.table)
          .whereIn('list_id', listIds)
          .distinct('user_id')
      ).map((listMember) => listMember.user_id),
    )
    const listTypes = new Set(
      (
        await this.dbReader<ListEntity>(ListEntity.table)
          .whereIn('id', listIds)
          .select('type')
      ).map((list) => list.type),
    )
    if (listTypes.has(ListTypeEnum.FOLLOWERS)) {
      followers.forEach((follow) => userIdsSet.add(follow.follower_id))
    }
    if (listTypes.has(ListTypeEnum.FOLLOWING)) {
      ;(
        await this.dbReader<FollowEntity>(FollowEntity.table)
          .where({ follower_id: userId })
          .select('creator_id')
      ).forEach((follow) => userIdsSet.add(follow.creator_id))
    }
    return new Set(
      followers
        .map((follower) => follower.follower_id)
        .filter((userId) => userIdsSet.has(userId)),
    )
  }

  async updateAsyncLists() {
    const lists = await this.dbReader<ListEntity>(ListEntity.table)
      .whereIn('type', [ListTypeEnum.TOP_SPENDERS])
      .select('*')
    await Promise.all(
      lists.map(async (list) => {
        await this.updateAsyncList(list)
      }),
    )
  }

  async updateAsyncList(list: ListEntity) {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (list.type) {
      case ListTypeEnum.TOP_SPENDERS:
        // eslint-disable-next-line no-case-declarations
        const topSpenders = (
          await this.dbReader<UserSpendingEntity>(UserSpendingEntity.table)
            .where({ creator_id: list.user_id })
            .orderBy('amount', 'desc')
            .limit(NUMBER_OF_TOP_SPENDERS)
            .select('*')
        ).map((spender) => {
          return {
            list_id: list.id,
            user_id: spender.user_id,
            meta_number: spender.amount,
          }
        })

        await this.dbWriter.transaction(async (trx) => {
          await trx<ListMemberEntity>(ListMemberEntity.table)
            .where({ list_id: list.id })
            .delete()
          if (topSpenders.length) {
            await trx<ListMemberEntity>(ListMemberEntity.table).insert(
              topSpenders,
            )
          }
          await trx<ListEntity>(ListEntity.table)
            .where({ id: list.id })
            .update({ count: topSpenders.length })
        })
        break
      default:
        break
    }
  }
}
