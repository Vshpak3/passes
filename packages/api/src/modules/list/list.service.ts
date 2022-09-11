// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { FollowEntity } from '../follow/entities/follow.entity'
import { FollowService } from '../follow/follow.service'
import { UserEntity } from '../user/entities/user.entity'
import { AddListMembersRequestDto } from './dto/add-list-members.dto'
import { CreateListRequestDto } from './dto/create-list.dto'
import { EditListNameRequestDto } from './dto/edit-list-name.dto'
import { GetListMembersRequestto } from './dto/get-list-members.dto'
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

    private readonly followService: FollowService,
  ) {}

  async createList(
    userId: string,
    createListDto: CreateListRequestDto,
  ): Promise<void> {
    const count = await this.dbReader
      .table(ListEntity.table)
      .where('user_id', userId)
      .count(['id'])
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

    await this.dbWriter.transaction(async (trx) => {
      await trx(ListEntity.table).insert(
        ListEntity.toDict<ListEntity>({
          id: listId,
          user: userId,
          name: createListDto.name,
        }),
      )
      if (listMemberRecords.length != 0) {
        await trx(ListMemberEntity.table)
          .insert(listMemberRecords)
          .onConflict(['list_id', 'user_id'])
          .ignore()
      }
    })
    await this.updateCount(listId)
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

  async fillAutomatedLists(lists: any[]) {
    await Promise.all(
      lists.map(async (list) => {
        switch (list.type) {
          case ListTypeEnum.FOLLOWERS:
            list.count = (
              await this.dbReader(CreatorStatEntity.table)
                .where('user_id', list.user_id)
                .select('num_followers')
                .first()
            )?.num_followers
            break
          case ListTypeEnum.FOLLOWING:
            list.count = (
              await this.dbReader(UserEntity.table)
                .where('id', list.user_id)
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
    const list = await this.dbReader(ListEntity.table)
      .where(ListEntity.toDict<ListEntity>({ id: listId, user: userId }))
      .select(`*`)
      .first()
    await this.fillAutomatedLists([list])
    return new ListDto(list)
  }

  async getListsForUser(userId: string): Promise<ListDto[]> {
    const lists = await this.dbReader(ListEntity.table)
      .where(ListEntity.toDict<ListEntity>({ user: userId }))
      .select(`*`)
    await this.fillAutomatedLists(lists)
    return lists.map((list) => new ListDto(list))
  }

  // TODO: put cursor pagination for names and created_at
  async getListMembers(
    userId: string,
    getListMembersRequestDto: GetListMembersRequestto,
  ) {
    const type = await this.checkList(
      userId,
      getListMembersRequestDto.listId,
      false,
    )
    switch (type) {
      case ListTypeEnum.NORMAL:
        return (
          await this.dbReader(ListMemberEntity.table)
            .leftJoin(
              UserEntity.table,
              `${ListMemberEntity.table}.user_id`,
              `${UserEntity.table}.id`,
            )
            .leftJoin(
              FollowEntity.table,
              `${ListMemberEntity.table}.user_id`,
              `${FollowEntity.table}.follower_id`,
            )
            .select([
              `${UserEntity.table}.id`,
              `${UserEntity.table}.username`,
              `${UserEntity.table}.display_name`,
              `${FollowEntity.table}.id as follow`,
            ])
            .where(
              `${ListMemberEntity.table}.list_id`,
              getListMembersRequestDto.listId,
            )
            .andWhere(`${FollowEntity.table}.creator_id`, userId)
            .orderBy(`${ListMemberEntity.table}.user_id`, 'ASC')
        ).map((listMember) => new ListMemberDto(listMember))
      case ListTypeEnum.FOLLOWERS:
        return await this.followService.searchFansByQuery(userId, {})
      case ListTypeEnum.FOLLOWING:
        return await this.followService.searchFollowingByQuery(userId, {})
      default:
        return []
    }
  }

  async checkList(
    userId: string,
    listId: string,
    manual: boolean,
  ): Promise<ListTypeEnum> {
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
    return list.type
  }

  async updateCount(listId: string) {
    const count = await this.dbReader
      .table(ListMemberEntity.table)
      .where('list_id', listId)
      .count()
    await this.dbWriter(ListEntity.table)
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

  async editListName(
    userId: string,
    editListNameRequestDto: EditListNameRequestDto,
  ): Promise<boolean> {
    const { listId, name } = editListNameRequestDto
    const updated = await this.dbWriter(ListEntity.table)
      .where(
        ListEntity.toDict<ListEntity>({
          id: listId,
          user: userId,
          type: ListTypeEnum.NORMAL,
        }),
      )
      .update(
        ListEntity.toDict<ListEntity>({
          name,
        }),
      )
    return updated === 1
  }
}
