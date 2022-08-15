import { Injectable, NotFoundException } from '@nestjs/common'
import { generateFromEmail } from 'unique-username-generator'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { USERNAME_TAKEN } from './constants/errors'
import { CreateUserDto } from './dto/create-user.dto'
import { SearchUserRequestDto } from './dto/search-user-request.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { knex } = this.ReadWriteDatabaseService
    const data = UserEntity.toDict<UserEntity>({
      ...createUserDto,
    })

    await knex(UserEntity.table).insert(data)
    // TODO: fix return type
    return data as any
  }

  async setUsername(userId: string, username: string): Promise<UserEntity> {
    const { knex } = this.ReadWriteDatabaseService
    // TODO: check if user query is needed
    const user = await knex(UserEntity.table).where({ id: userId }).first()
    const data = UserEntity.toDict<UserEntity>({
      username,
    })

    const query = () =>
      knex(UserEntity.table).update(data).where({ id: userId })
    await createOrThrowOnDuplicate(query, USERNAME_TAKEN)

    return { ...user, ...data }
  }

  async createOAuthUser(
    email: string,
    provider: string,
    providerId: string,
  ): Promise<UserEntity> {
    const { knex } = this.ReadWriteDatabaseService
    const data = UserEntity.toDict<UserEntity>({
      email,
      username: generateFromEmail(email, 3),
      oauthId: providerId,
      oauthProvider: provider,
    })
    await knex(UserEntity.table).insert(data)
    // TODO: fix return type
    return data as any
  }

  async findOne(id: string): Promise<UserEntity> {
    const { knex } = this.ReadOnlyDatabaseService
    const user = await knex(UserEntity.table).where({ id }).first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return user
  }

  async findOneByOAuth(
    oauthId: string,
    oauthProvider: string,
  ): Promise<UserEntity | null> {
    return await this.ReadOnlyDatabaseService.knex(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ oauthId, oauthProvider }))
      .first()
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const { knex } = this.ReadWriteDatabaseService
    // TODO: check if user query is needed
    const currentUser = await this.findOne(userId)

    // TODO: Only certain user fields should be allowed to be updated
    const data = UserEntity.toDict<UserEntity>({
      ...updateUserDto,
    })
    await knex(UserEntity.table).update(data).where({ id: userId })
    return { ...currentUser, ...data }
  }

  async remove(userId: string): Promise<UserEntity> {
    const { knex } = this.ReadWriteDatabaseService
    // TODO: check if user query is needed
    const currentUser = await this.findOne(userId)

    const data = UserEntity.toDict<UserEntity>({
      isDisabled: true,
    })
    await knex(UserEntity.table).update(data).where({ id: userId })
    return { ...currentUser, ...data }
  }

  // TODO: Sort by creators that the user follows, most interacted with first?
  async searchByQuery(searchUserDto: SearchUserRequestDto) {
    const { knex } = this.ReadOnlyDatabaseService
    const strippedQuery = searchUserDto.query.replace(/\W/g, '')
    const likeClause = `%${strippedQuery}%`
    return await knex(UserEntity.table)
      .where(function () {
        this.whereILike('username', likeClause).orWhereILike(
          'display_name',
          likeClause,
        )
      })
      .andWhere(
        UserEntity.toDict<UserEntity>({
          isCreator: true,
          isDisabled: false,
        }),
      )
      .limit(10)
  }

  async validateUsername(username: string): Promise<boolean> {
    const { knex } = this.ReadOnlyDatabaseService
    const user = await knex(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ username }))
      .first()
    return !user
  }
}
