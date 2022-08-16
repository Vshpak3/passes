// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { UserEntity } from '../user/entities/user.entity'
import { AddListMemberDto } from './dto/add-list-member.dto'
import { CreateListDto } from './dto/create-list.dto'
import { GetListDto } from './dto/get-list.dto'
import { GetListMemberDto } from './dto/get-list-member.dto'
import { GetListsDto } from './dto/get-lists.dto'
import { RemoveListMemberDto } from './dto/remove-list-member.dto'
import { ListEntity } from './entities/list.entity'
import { ListMemberEntity } from './entities/list-member.entity'

export const LIST_MEMBER_EXISTS = 'List member already exists'

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
    createListDto: CreateListDto,
  ): Promise<GetListDto> {
    const listId = uuid.v4()
    await this.dbWriter(ListEntity.table).insert({
      id: listId,
      user_id: userId,
      name: createListDto.name,
    })
    return new GetListDto(listId, createListDto.name, [], 0)
  }

  async deleteList(userId: string, id: string): Promise<boolean> {
    const dbResult = await this.dbWriter(ListEntity.table)
      .where('list.user_id', userId)
      .where('list.id', id)
      .delete()
    return dbResult == 1
  }

  async getList(userId: string, id: string): Promise<GetListDto> {
    const dbResult = await this.dbReader(ListEntity.table)
      .leftJoin(ListMemberEntity.table, 'list_member.list_id', 'list.id')
      .leftJoin(UserEntity.table, 'list_member.user_id', 'users.id')
      .select('list.id', 'list.name', 'list_member.user_id', 'users.username')
      .where('list.user_id', userId)
      .where('list.id', id)

    const listMembers = dbResult
      .map((listMember) => {
        if (listMember.user_id && listMember.username) {
          return new GetListMemberDto(listMember.user_id, listMember.username)
        } else {
          return undefined
        }
      })
      .filter((listMember) => listMember != undefined)

    return new GetListDto(
      dbResult[0].id,
      dbResult[0].name,
      listMembers as GetListMemberDto[],
      (listMembers as GetListMemberDto[]).length,
    )
  }

  async getListsForUser(userId: string): Promise<GetListsDto> {
    const dbResult = await this.dbReader(ListEntity.table)
      .select('list.id', this.dbReader.raw('count(list_member.id) as count'))
      .leftJoin(ListMemberEntity.table, 'list_member.list_id', '=', 'list.id')
      .where('list.user_id', userId)
      .groupBy('list.id')

    return new GetListsDto(
      dbResult.map((list) => {
        return new GetListDto(list.id, list.name, [], list.count)
      }),
    )
  }

  async addListMember(
    userId: string,
    addListMemberDto: AddListMemberDto,
  ): Promise<void> {
    const listResult = await this.dbReader(ListEntity.table)
      .select('*')
      .where({ user_id: userId, id: addListMemberDto.list })

    if (listResult[0] == undefined) {
      throw new NotFoundException('list not found')
    }

    const query = () =>
      this.dbWriter(ListMemberEntity.table).insert({
        list_id: addListMemberDto.list,
        user_id: addListMemberDto.user,
      })
    await createOrThrowOnDuplicate(query, this.logger, LIST_MEMBER_EXISTS)
  }

  async removeListMember(
    userId: string,
    removeListMemberDto: RemoveListMemberDto,
  ): Promise<boolean> {
    const listResult = await this.dbReader(ListEntity.table)
      .select('*')
      .where({ user_id: userId, id: removeListMemberDto.list })

    if (listResult[0] == undefined) {
      throw new NotFoundException('list not found')
    }
    const dbResult = await this.dbWriter(ListMemberEntity.table)
      .where('list_member.list_id', removeListMemberDto.list)
      .where('list_member.user_id', removeListMemberDto.user)
      .delete()
    return dbResult == 1
  }
}
