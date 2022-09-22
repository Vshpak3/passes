import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { CreateUserRequestDto } from '../auth/dto/create-user.dto'
import { AuthEntity } from '../auth/entities/auth.entity'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { ListEntity } from '../list/entities/list.entity'
import { ListTypeEnum } from '../list/enum/list.type.enum'
import { NotificationSettingsEntity } from '../notifications/entities/notification-settings.entity'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import { USERNAME_TAKEN } from './constants/errors'
import {
  MAX_USERNAME_RESET_COUNT_PER_TIMEFRAME,
  USERNAME_RESET_TIME_SPAN_MS as USERNAME_RESET_TIMEFRAME_MS,
} from './constants/username'
import {
  SearchCreatorRequestDto,
  SearchCreatorResponseDto,
} from './dto/search-creator.dto'
import { UserDto } from './dto/user.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    @Inject(RedisLockService)
    protected readonly lockService: RedisLockService,
  ) {}

  async createUser(
    authId: string,
    email: string,
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserDto> {
    if (await this.isUsernameTaken(createUserRequestDto.username)) {
      throw new ConflictException(USERNAME_TAKEN)
    }

    const user = UserEntity.toDict<UserEntity>({
      id: v4(),
      email,
      ...createUserRequestDto,
    })

    await this.dbWriter.transaction(async (trx) => {
      await trx(UserEntity.table).insert(user)
      await trx(AuthEntity.table)
        .update(AuthEntity.toDict<AuthEntity>({ user: user.id }))
        .where({ id: authId })
      await trx(NotificationSettingsEntity.table).insert(
        NotificationSettingsEntity.toDict<NotificationSettingsEntity>({
          user: user.id,
        }),
      )
    })

    return new UserDto(user)
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.dbReader(UserEntity.table)
      .where({ id })
      .select('*')
      .first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return new UserDto(user)
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    const user = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ username }))
      .select('*')
      .first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return new UserDto(user)
  }

  private async runAtMostXTimesInTimeframe(
    timeframe: number,
    maxCount: number,
    key: string,
    fn: () => void,
  ) {
    let redisKey = ''
    try {
      for (let i = 0; i < maxCount; i++) {
        redisKey = `${key}:${i.toString()}`
        if (await this.lockService.lockOnce(redisKey, timeframe)) {
          fn.bind(this)()
          return
        }
      }
    } catch (err) {
      if (redisKey) {
        await this.lockService.unlock(redisKey)
      }
      throw err
    }
    throw new BadRequestException('Maximum username reset limit hit')
  }

  async setUsername(userId: string, username: string): Promise<void> {
    await this.runAtMostXTimesInTimeframe(
      USERNAME_RESET_TIMEFRAME_MS,
      MAX_USERNAME_RESET_COUNT_PER_TIMEFRAME,
      `setUsername:${userId}`,
      async function () {
        const query = () =>
          this.dbWriter(UserEntity.table)
            .update(UserEntity.toDict<UserEntity>({ username }))
            .where({ id: userId })
        await createOrThrowOnDuplicate(query, this.logger, USERNAME_TAKEN)
      },
    )
  }

  async setDisplayName(userId: string, displayName: string): Promise<void> {
    await this.dbWriter(UserEntity.table)
      .update(
        UserEntity.toDict<UserEntity>({
          displayName,
        }),
      )
      .where({ id: userId })
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    try {
      await this.findOneByUsername(username)
      return true
    } catch (err) {
      return false
    }
  }

  async deactivateUser(userId: string): Promise<boolean> {
    const updated = await this.dbWriter(UserEntity.table)
      .update(
        UserEntity.toDict<UserEntity>({
          isActive: true,
        }),
      )
      .where(
        UserEntity.toDict<UserEntity>({
          id: userId,
          isActive: false,
        }),
      )
    return updated === 1
  }

  async activateUser(userId: string): Promise<boolean> {
    const updated = await this.dbWriter(UserEntity.table)
      .update(
        UserEntity.toDict<UserEntity>({
          isActive: false,
        }),
      )
      .where(
        UserEntity.toDict<UserEntity>({
          id: userId,
          isActive: true,
        }),
      )
    return updated === 1
  }

  async getIdFromUsername(username: string) {
    const user = await this.dbReader(UserEntity.table)
      .where('username', username)
      .select('id')
      .first()
    return user ? user.id : ''
  }

  async searchByQuery(
    searchCreatorDto: SearchCreatorRequestDto,
  ): Promise<SearchCreatorResponseDto> {
    const strippedQuery = searchCreatorDto.query.replace(/\W/g, '')
    const likeClause = `%${strippedQuery}%`
    return new SearchCreatorResponseDto(
      await this.dbReader(UserEntity.table)
        .where(async function () {
          await this.whereILike('username', likeClause).orWhereILike(
            'display_name',
            likeClause,
          )
        })
        .andWhere(
          UserEntity.toDict<UserEntity>({
            isCreator: true,
            isActive: true,
          }),
        )
        .limit(10),
    )
  }

  async makeAdult(userId: string): Promise<void> {
    await this.dbWriter(UserEntity.table)
      .update(UserEntity.toDict<UserEntity>({ isAdult: true }))
      .where({ id: userId })
  }

  async makeCreator(userId: string): Promise<void> {
    await this.dbWriter.transaction(async (trx) => {
      await trx(UserEntity.table).where('id', userId).update('is_creator', true)
      await trx(CreatorSettingsEntity.table)
        .insert(
          CreatorSettingsEntity.toDict<CreatorSettingsEntity>({ user: userId }),
        )
        .onConflict('user_id')
        .ignore()
      await trx(CreatorStatEntity.table)
        .insert(CreatorStatEntity.toDict<CreatorStatEntity>({ user: userId }))
        .onConflict('user_id')
        .ignore()
      await trx(ListEntity.table)
        .where(
          ListEntity.toDict<ListEntity>({
            user: userId,
            type: ListTypeEnum.FOLLOWING,
          }),
        )
        .delete()
      await trx(ListEntity.table)
        .where(
          ListEntity.toDict<ListEntity>({
            user: userId,
            type: ListTypeEnum.FOLLOWERS,
          }),
        )
        .delete()
      await trx(ListEntity.table).insert([
        ListEntity.toDict<ListEntity>({
          user: userId,
          name: 'Following',
          type: ListTypeEnum.FOLLOWING,
        }),
        ListEntity.toDict<ListEntity>({
          user: userId,
          name: 'Fans',
          type: ListTypeEnum.FOLLOWERS,
        }),
      ])
    })
  }
}
