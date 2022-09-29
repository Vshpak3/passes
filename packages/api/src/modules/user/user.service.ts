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
import { ChainEnum } from '../wallet/enum/chain.enum'
import { WalletService } from '../wallet/wallet.service'
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
    protected readonly walletService: WalletService,
  ) {}

  async createUser(
    authId: string,
    email: string,
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserDto> {
    if (await this.isUsernameTaken(createUserRequestDto.username)) {
      throw new ConflictException(USERNAME_TAKEN)
    }

    const user = {
      id: v4(),
      email,
      birthday: createUserRequestDto.birthday,
      country_code: createUserRequestDto.countryCode,
      legal_full_name: createUserRequestDto.legalFullName,
      username: createUserRequestDto.username,
    } as UserEntity

    await this.dbWriter.transaction(async (trx) => {
      await trx<UserEntity>(UserEntity.table).insert(user)
      await trx<AuthEntity>(AuthEntity.table)
        .update({ user_id: user.id })
        .where({ id: authId })
      await trx<NotificationSettingsEntity>(
        NotificationSettingsEntity.table,
      ).insert({ user_id: user.id })
    })

    // create custodial wallets on create user
    await this.walletService.getUserCustodialWallet(user.id, ChainEnum.SOL)
    await this.walletService.getUserCustodialWallet(user.id, ChainEnum.ETH)

    return new UserDto(user)
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id })
      .select('*')
      .first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    // For some reason knex converts this to a Date but is typed as a string...
    user.birthday = new Date(user.birthday).toISOString().split('T')[0]

    return new UserDto(user)
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ username })
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
      async () => {
        const query = () =>
          this.dbWriter<UserEntity>(UserEntity.table)
            .update({ username: username })
            .where({ id: userId })
        await createOrThrowOnDuplicate(query, this.logger, USERNAME_TAKEN)
      },
    )
  }

  async setDisplayName(userId: string, displayName: string): Promise<void> {
    await this.dbWriter<UserEntity>(UserEntity.table)
      .update({ display_name: displayName })
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
    const updated = await this.dbWriter<UserEntity>(UserEntity.table)
      .update({ is_active: true })
      .where({ id: userId, is_active: false })
    return updated === 1
  }

  async activateUser(userId: string): Promise<boolean> {
    const updated = await this.dbWriter<UserEntity>(UserEntity.table)
      .update({
        is_active: false,
      })
      .where({
        id: userId,
        is_active: true,
      })
    return updated === 1
  }

  async getIdFromUsername(username: string) {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ username })
      .select('id')
      .first()
    return user ? user.id : ''
  }

  async searchByQuery(
    searchCreatorDto: SearchCreatorRequestDto,
  ): Promise<SearchCreatorResponseDto> {
    if (!searchCreatorDto.query) {
      return new SearchCreatorResponseDto([])
    }

    const strippedQuery = searchCreatorDto.query.replace(/\W/g, '')
    const likeClause = `%${strippedQuery}%`
    const creators = await this.dbReader<UserEntity>(UserEntity.table)
      .select('id', 'username', 'display_name as displayName')
      .where(function () {
        return this.whereILike('username', likeClause).orWhereILike(
          'display_name',
          likeClause,
        )
      })
      .andWhere({
        is_creator: true,
        is_active: true,
      })
      .limit(10)

    return new SearchCreatorResponseDto(creators)
  }

  async makeAdult(userId: string): Promise<void> {
    await this.dbWriter<UserEntity>(UserEntity.table)
      .update({ is_adult: true })
      .where({ id: userId })
  }

  async isPasswordUser(userId: string): Promise<boolean> {
    return !!(await this.dbReader<AuthEntity>(AuthEntity.table)
      .whereNotNull('password_hash')
      .andWhere({ user_id: userId })
      .select('id')
      .first())
  }

  async makeCreator(userId: string): Promise<void> {
    await this.dbWriter.transaction(async (trx) => {
      await trx<UserEntity>(UserEntity.table)
        .where({ id: userId })
        .update({ is_creator: true })
      await trx<CreatorSettingsEntity>(CreatorSettingsEntity.table)
        .insert({ user_id: userId })
        .onConflict('user_id')
        .ignore()
      await trx<CreatorStatEntity>(CreatorStatEntity.table)
        .insert({ user_id: userId })
        .onConflict('user_id')
        .ignore()
      await trx<ListEntity>(ListEntity.table)
        .where({
          user_id: userId,
          type: ListTypeEnum.FOLLOWING,
        })
        .delete()
      await trx<ListEntity>(ListEntity.table)
        .where({
          user_id: userId,
          type: ListTypeEnum.FOLLOWERS,
        })
        .delete()
      await trx<ListEntity>(ListEntity.table).insert([
        {
          user_id: userId,
          name: 'Following',
          type: ListTypeEnum.FOLLOWING,
        },
        {
          user_id: userId,
          name: 'Fans',
          type: ListTypeEnum.FOLLOWERS,
        },
      ])
    })
  }
}
