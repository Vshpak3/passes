// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { FollowEntity } from '../follow/entities/follow.entity'
import { UserEntity } from '../user/entities/user.entity'
import { CreateListRequestDto } from './dto/create-list.dto'
import { GetListResponseDto } from './dto/get-list.dto'
import { GetListsResponseDto } from './dto/get-lists.dto'
import { ListMemberDto } from './dto/list-member.dto'
import { ListMembersRequestDto } from './dto/list-members.dto'
import { ListEntity } from './entities/list.entity'
import { ListMemberEntity } from './entities/list-member.entity'

const LIST_MEMBER_EXISTS = 'List member already exists'

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

  async create(
    userId: string,
    createListDto: CreateListRequestDto,
  ): Promise<GetListResponseDto> {
    const listId = uuid.v4()
    let followResult: any[] = []
    let listMemberRecords: any[] = []

    if (createListDto.users) {
      followResult = await this.dbReader(FollowEntity.table)
        .innerJoin(UserEntity.table, 'users.id', 'follow.subscriber_id')
        .select(
          'follow.subscriber_id',
          'users.id',
          'users.username',
          'users.display_name',
        )
        .where('follow.creator_id', userId)
        .whereIn('follow.subscriber_id', createListDto.users)

      listMemberRecords = followResult.map(
        (followResult: { subscriber_id: string }) => {
          return ListMemberEntity.toDict<ListMemberEntity>({
            list: listId,
            user: followResult.subscriber_id,
          })
        },
      )
    }

    await this.dbWriter.transaction(async (trx) => {
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
    })

    return new GetListResponseDto(
      listId,
      createListDto.name,
      followResult.map((followResult) => {
        return new ListMemberDto(followResult.user_id, followResult.username)
      }),
      listMemberRecords.length,
    )
  }

  async deleteList(userId: string, id: string): Promise<boolean> {
    const dbResult = await this.dbWriter(ListEntity.table)
      .where('list.user_id', userId)
      .where('list.id', id)
      .delete()
    return dbResult == 1
  }

  async getList(
    userId: string,
    id: string,
    cursor?: string,
  ): Promise<GetListResponseDto> {
    const listMemberQuery = this.dbReader(ListEntity.table)
      .leftJoin(ListMemberEntity.table, 'list_member.list_id', 'list.id')
      .leftJoin(UserEntity.table, 'list_member.user_id', 'users.id')
      .select('list.id', 'list.name', 'list_member.user_id', 'users.username')
      .where('list.user_id', userId)
      .where('list.id', id)

    if (cursor) {
      await listMemberQuery.where('list_member.user_id', '>', cursor)
    }
    await listMemberQuery.orderBy('users.display_name', 'asc')

    const dbResult = await listMemberQuery

    const listMembers = dbResult
      .map((listMember) => {
        if (listMember.user_id && listMember.username) {
          return new ListMemberDto(listMember.user_id, listMember.username)
        } else {
          return undefined
        }
      })
      .filter((listMember) => listMember != undefined)

    return new GetListResponseDto(
      dbResult[0].id,
      dbResult[0].name,
      listMembers as ListMemberDto[],
      (listMembers as ListMemberDto[]).length,
    )
  }

  async getListsForUser(
    userId: string,
    cursor?: string,
  ): Promise<GetListsResponseDto> {
    const listQuery = this.dbReader(ListEntity.table)
      .select(
        'list.id',
        'list.name',
        this.dbReader.raw('count(list_member.id) as count'),
      )
      .leftJoin(ListMemberEntity.table, 'list_member.list_id', '=', 'list.id')
      .where('list.user_id', userId)

    if (cursor) {
      await listQuery.where('list.id', '>', cursor)
    }
    await listQuery.orderBy('list.name', 'asc')
    await listQuery.groupBy('list.id')

    return new GetListsResponseDto(
      (await listQuery).map((list) => {
        return new GetListResponseDto(list.id, list.name, [], list.count)
      }),
    )
  }

  async addListMembers(
    userId: string,
    listId: string,
    addListMembersDto: ListMembersRequestDto,
  ): Promise<void> {
    const listResult = await this.dbReader(ListEntity.table)
      .select('*')
      .where({ user_id: userId, id: listId })

    if (listResult[0] == undefined) {
      throw new NotFoundException('list not found')
    }

    const followResult = await this.dbReader(FollowEntity.table)
      .select('follow.subscriber_id')
      .where('follow.creator_id', userId)
      .whereIn('follow.subscriber_id', addListMembersDto.users)

    const records = followResult.map((followResult) => {
      return {
        id: uuid.v4(),
        list_id: listId,
        user_id: followResult.subscriber_id,
      }
    })

    const query = () => this.dbWriter(ListMemberEntity.table).insert(records)
    await createOrThrowOnDuplicate(query, this.logger, LIST_MEMBER_EXISTS)
  }

  async removeListMembers(
    userId: string,
    listId: string,
    removeListMembersDto: ListMembersRequestDto,
  ): Promise<void> {
    const listResult = await this.dbReader(ListEntity.table)
      .select('*')
      .where({ user_id: userId, id: listId })

    if (listResult[0] == undefined) {
      throw new NotFoundException('list not found')
    }
    await this.dbWriter(ListMemberEntity.table)
      .where('list_member.list_id', listId)
      .whereIn('list_member.user_id', removeListMembersDto.users)
      .delete()
  }
}
