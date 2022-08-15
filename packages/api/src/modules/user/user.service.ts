import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { generateFromEmail } from 'unique-username-generator'
import { Logger } from 'winston'

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
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const data = UserEntity.toDict<UserEntity>({
      ...createUserDto,
    })

    await this.dbWriter(UserEntity.table).insert(data)
    // TODO: fix return type
    return data as any
  }

  async setUsername(userId: string, username: string): Promise<UserEntity> {
    // TODO: check if user query is needed
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()
    const data = UserEntity.toDict<UserEntity>({
      username,
    })

    const query = () =>
      this.dbWriter(UserEntity.table).update(data).where({ id: userId })
    await createOrThrowOnDuplicate(query, this.logger, USERNAME_TAKEN)

    return { ...user, ...data }
  }

  async createOAuthUser(
    email: string,
    provider: string,
    providerId: string,
  ): Promise<UserEntity> {
    const data = UserEntity.toDict<UserEntity>({
      email,
      username: generateFromEmail(email, 3),
      oauthId: providerId,
      oauthProvider: provider,
    })
    await this.dbWriter(UserEntity.table).insert(data)
    // TODO: fix return type
    return data as any
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.dbReader(UserEntity.table).where({ id }).first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return user
  }

  async findOneByOAuth(
    oauthId: string,
    oauthProvider: string,
  ): Promise<UserEntity | null> {
    return await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ oauthId, oauthProvider }))
      .first()
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    // TODO: check if user query is needed
    const currentUser = await this.findOne(userId)

    // TODO: Only certain user fields should be allowed to be updated
    const data = UserEntity.toDict<UserEntity>({
      ...updateUserDto,
    })
    await this.dbWriter(UserEntity.table).update(data).where({ id: userId })
    return { ...currentUser, ...data }
  }

  async remove(userId: string): Promise<UserEntity> {
    // TODO: check if user query is needed
    const currentUser = await this.findOne(userId)

    const data = UserEntity.toDict<UserEntity>({
      isDisabled: true,
    })
    await this.dbWriter(UserEntity.table).update(data).where({ id: userId })
    return { ...currentUser, ...data }
  }

  // TODO: Sort by creators that the user follows, most interacted with first?
  async searchByQuery(searchUserDto: SearchUserRequestDto) {
    const strippedQuery = searchUserDto.query.replace(/\W/g, '')
    const likeClause = `%${strippedQuery}%`
    return await this.dbReader(UserEntity.table)
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
    const user = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ username }))
      .first()
    return !user
  }
}
