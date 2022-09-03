// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import { Knex } from '@mikro-orm/mysql'
import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { FollowEntity } from '../follow/entities/follow.entity'
import { PassEntity } from '../pass/entities/pass.entity'
import { UserEntity } from '../user/entities/user.entity'
import { AddListMembersRequestDto } from './dto/add-list-members.dto'
import { CreateListRequestDto } from './dto/create-list.dto'
import { GetListResponseDto } from './dto/get-list.dto'
import { GetListMembersRequestto } from './dto/get-list-members.dto'
import { GetListsResponseDto } from './dto/get-lists.dto'
import { ListDto } from './dto/list.dto'
import { ListMemberDto } from './dto/list-member.dto'
import { RemoveListMembersRequestDto } from './dto/remove-list-members.dto'
import { ListEntity } from './entities/list.entity'
import { ListMemberEntity } from './entities/list-member.entity'
import { ListTypeEnum } from './enum/list.type.enum'
import {
  IncorrectListTypeError,
  ListLimitReachedError,
  NoListError,
} from './error/list.error'

const LIST_LIMIT = 1000

@Injectable()
export class ListService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async createList(
    userId: string,
    createListDto: CreateListRequestDto,
  ): Promise<void> {
    const count = await this.dbReader
      .table(ListEntity.table)
      .where('user_id', userId)
      .count()
    if (count[0]['count(*)'] >= LIST_LIMIT)
      throw new ListLimitReachedError('list limit reached')

    const listId = uuid.v4()
    let listMemberRecords: any[] = []

    const followers = await this.dbReader(FollowEntity.table)
      .where('creator_id', userId)
      .whereIn('follower_id', createListDto.userIds)
      .select('follower_id')

    listMemberRecords = followers.map((follower) => {
      return ListMemberEntity.toDict<ListMemberEntity>({
        list: listId,
        user: follower.follower_id,
      })
    })

    await createOrThrowOnDuplicate(
      () =>
        this.dbWriter.transaction(async (trx) => {
          await trx(ListEntity.table).insert(
            ListEntity.toDict<ListEntity>({
              id: listId,
              user: userId,
              name: createListDto.name,
            }),
          )
          if (listMemberRecords.length != 0) {
            await trx(ListMemberEntity.table).insert(listMemberRecords)
          }
        }),
      this.logger,
      "can't use same list name and type",
    )
  }

  async deleteList(userId: string, id: string): Promise<boolean> {
    const dbResult = await this.dbWriter(ListEntity.table)
      .where(
        ListEntity.toDict<ListEntity>({
          id,
          user: userId,
          type: ListTypeEnum.NORMAL,
        }),
      )
      .delete()
    return dbResult == 1
  }

  async getList(userId: string, listId: string): Promise<GetListResponseDto> {
    const list = this.dbReader(ListEntity.table)
      .leftJoin(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${ListEntity.table}.pass_id`,
      )
      .where(ListEntity.toDict<ListEntity>({ id: listId, user: userId }))
      .select(
        `${ListEntity.table}.*`,
        `${PassEntity.table}.title as pass_title`,
      )
      .first()
    const count = await this.dbReader
      .table(ListMemberEntity.table)
      .where('list_id', listId)
      .count()
    list.count = count[0]['count(*)']
    return new GetListResponseDto(list)
  }

  async getListsForUser(userId: string): Promise<GetListsResponseDto> {
    const lists = await this.dbReader(ListEntity.table)
      .leftJoin(
        PassEntity.table,
        `${PassEntity.table}.id`,
        `${ListEntity.table}.pass_id`,
      )
      .where(ListEntity.toDict<ListEntity>({ user: userId }))
      .select(
        `${ListEntity.table}.*`,
        `${PassEntity.table}.title as pass_title`,
      )
    await Promise.all(
      lists.map(async (list) => {
        const count = await this.dbReader
          .table(ListMemberEntity.table)
          .where('list_id', list.id)
          .count()
        list.count = count[0]['count(*)']
      }),
    )
    return new GetListsResponseDto(lists.map((list) => new ListDto(list)))
  }

  // TODO: put cursor pagination for names and created_at
  async getListMembers(
    userId: string,
    getListMembersRequestDto: GetListMembersRequestto,
  ) {
    await this.checkList(userId, getListMembersRequestDto.listId, false)
    const listMembers = await this.dbReader(ListMemberEntity.table)
      .leftJoin(
        UserEntity.table,
        `${ListMemberEntity.table}.user_id`,
        `${UserEntity.table}.id`,
      )
      .select([
        `${UserEntity.table}.id`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
      ])
      .where(
        `${ListMemberEntity.table}.list_id`,
        getListMembersRequestDto.listId,
      )
      .orderBy(`${ListMemberEntity.table}.user_id`, 'ASC')
    return listMembers.map((listMember) => new ListMemberDto(listMember))
  }

  async checkList(userId: string, listId: string, manual: boolean) {
    const list = await this.dbReader(ListEntity.table)
      .where(
        ListEntity.toDict<ListEntity>({
          user: userId,
          id: listId,
        }),
      )
      .select('type')
      .first()
    if (list == undefined) {
      throw new NoListError('list not found')
    }
    if (manual && list.type !== ListTypeEnum.NORMAL) {
      throw new IncorrectListTypeError('can not manually alter this list')
    }
  }

  async updateCount(listId: string) {
    const count = await this.dbReader
      .table(ListMemberEntity.table)
      .where('list_id', listId)
      .count()
    await this.dbWriter
      .where('id', listId)
      .update('count', count[0]['count(*)'])
  }

  async addListMembers(
    userId: string,
    addListMembersDto: AddListMembersRequestDto,
    manual: boolean,
  ): Promise<void> {
    await this.checkList(userId, addListMembersDto.listId, manual)

    const followers = await this.dbReader(FollowEntity.table)
      .select('follower_id')
      .where('creator_id', userId)
      .whereIn('follower_id', addListMembersDto.userIds)

    await this.dbWriter(ListMemberEntity.table)
      .insert(
        followers.map((follower) =>
          ListMemberEntity.toDict<ListMemberEntity>({
            list: addListMembersDto.listId,
            user: follower.follower_id,
          }),
        ),
      )
      .onConflict(['list_id', 'user_id'])
      .ignore()
    await this.updateCount(addListMembersDto.listId)
  }

  async removeListMembers(
    userId: string,
    removeListMembersDto: RemoveListMembersRequestDto,
    manual: true,
  ): Promise<void> {
    await this.checkList(userId, removeListMembersDto.listId, manual)

    await this.dbWriter(ListMemberEntity.table)
      .where('list_id', removeListMembersDto.listId)
      .whereIn('user_id', removeListMembersDto.userIds)
      .delete()
    await this.updateCount(removeListMembersDto.listId)
  }

  async updateListByType(
    userId: string,
    creatorId: string,
    type: ListTypeEnum,
    action: 'add' | 'remove',
    knex?: Knex<any, any[]>,
  ) {
    const listId = (
      await this.dbReader(ListEntity.table)
        .where(ListEntity.toDict<ListEntity>({ user: creatorId, type }))
        .select('id')
        .first()
    )?.id
    if (!listId) return

    if (!knex) knex = this.dbWriter
    switch (action) {
      case 'add':
        await knex(ListMemberEntity.table)
          .insert(
            ListMemberEntity.toDict<ListMemberEntity>({
              list: listId,
              user: userId,
            }),
          )
          .onConflict(['list_id', 'user_id'])
          .ignore()
        break
      case 'remove':
        await knex(ListMemberEntity.table)
          .where(
            ListMemberEntity.toDict<ListMemberEntity>({
              list: listId,
              user: userId,
            }),
          )
          .delete()
        break
    }
  }
}
