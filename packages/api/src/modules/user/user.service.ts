import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { differenceInYears } from 'date-fns'
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
import { NUMBER_OF_TOP_SPENDERS } from '../list/list.service'
import { NotificationSettingsEntity } from '../notifications/entities/notification-settings.entity'
import { PassService } from '../pass/pass.service'
import { ProfileEntity } from '../profile/entities/profile.entity'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { WalletService } from '../wallet/wallet.service'
import { USER_MIN_AGE_NOT_MET, USERNAME_TAKEN } from './constants/errors'
import { USER_MIN_AGE } from './constants/schema'
import {
  MAX_USERNAME_RESET_COUNT_PER_TIMEFRAME,
  USERNAME_RESET_TIME_SPAN_MS as USERNAME_RESET_TIMEFRAME_MS,
} from './constants/username'
import {
  SearchCreatorRequestDto,
  SearchCreatorResponseDto,
} from './dto/search-creator.dto'
import { UserDto } from './dto/user.dto'
import { UserEntity, UserIndexes } from './entities/user.entity'
import { WhitelistedUsersEntity } from './entities/whitelisted-users.entity'

const CREATOR_SEARCH_LIMIT = 10

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
    protected readonly passService: PassService,
  ) {}

  async createWhitelistedPasses(userId: string) {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: userId })
      .select(['email'])
      .first()
    if (!user || user.email !== 'patrick@passes.com') {
      throw new InternalServerErrorException(
        `Unexpected missing user: ${userId}`,
      )
    }
    const users = await this.dbReader<WhitelistedUsersEntity>(
      WhitelistedUsersEntity.table,
    )
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.email`,
        `${WhitelistedUsersEntity.table}.email`,
      )
      .distinct(`${UserEntity.table}.id`, `${UserEntity.table}.email`)
    await Promise.all(
      users.map(async (user) => {
        await this.createWhitelistedPassesForUser(user.id, user.email)
      }),
    )
  }

  private async createWhitelistedPassesForUser(userId: string, email: string) {
    const whitelisted = await this.dbReader<WhitelistedUsersEntity>(
      WhitelistedUsersEntity.table,
    )
      .where({ email, created: false })
      .select('*')
    for (let i = 0; i < whitelisted.length; ++i) {
      await this.passService.createPassHolder(userId, whitelisted[i].pass_id)
      await this.dbWriter<WhitelistedUsersEntity>(WhitelistedUsersEntity.table)
        .where({ id: whitelisted[i].id })
        .update({ created: true })
      await this.passService.addSupply(whitelisted[i].pass_id)
    }
  }

  async createUser(
    authId: string,
    email: string,
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserDto> {
    if (await this.isUsernameTaken(createUserRequestDto.username)) {
      throw new ConflictException(USERNAME_TAKEN)
    }

    if (
      differenceInYears(new Date(), new Date(createUserRequestDto.birthday)) <
      USER_MIN_AGE
    ) {
      throw new BadRequestException(USER_MIN_AGE_NOT_MET)
    }

    const user = {
      id: v4(),
      email,
      birthday: createUserRequestDto.birthday,
      country_code: createUserRequestDto.countryCode,
      legal_full_name: createUserRequestDto.legalFullName,
      username: createUserRequestDto.username,
      display_name: createUserRequestDto.displayName,
    } as UserEntity

    await this.dbWriter.transaction(async (trx) => {
      await trx<UserEntity>(UserEntity.table).insert(user)
      await trx<AuthEntity>(AuthEntity.table)
        .update({ user_id: user.id })
        .where({ id: authId })
      await trx<NotificationSettingsEntity>(
        NotificationSettingsEntity.table,
      ).insert({ user_id: user.id })
      await trx<ProfileEntity>(ProfileEntity.table).insert({
        user_id: user.id,
      })
    })

    // create custodial wallets on create user
    await this.walletService.getUserCustodialWallet(user.id, ChainEnum.SOL)
    await this.walletService.getUserCustodialWallet(user.id, ChainEnum.ETH)
    await this.createWhitelistedPassesForUser(user.id, email)
    return new UserDto(user)
  }

  async findOne({
    id,
    username,
    email,
    display_name,
  }: UserIndexes): Promise<UserDto> {
    const whereClause = {
      ...(id && { id }),
      ...(username && { username }),
      ...(email && { email }),
      ...(display_name && { display_name }),
    }

    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where(whereClause)
      .select('*')
      .first()

    if (!user) {
      throw new BadRequestException('User does not exist')
    }

    // For some reason knex converts this to a Date but is typed as a string...
    user.birthday = new Date(user.birthday).toISOString().split('T')[0]

    return new UserDto(user)
  }

  private async runAtMostXTimesInTimeframe(
    timeframe: number,
    maxCount: number,
    key: string,
    onFailure: () => void,
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
    onFailure()
  }

  async setUsername(userId: string, username: string): Promise<void> {
    await this.runAtMostXTimesInTimeframe(
      USERNAME_RESET_TIMEFRAME_MS,
      MAX_USERNAME_RESET_COUNT_PER_TIMEFRAME,
      `setUsername:${userId}`,
      () => {
        throw new BadRequestException(
          'You have updated your username the max number of times for today',
        )
      },
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
    if (displayName.trim().length === 0) {
      throw new BadRequestException('The display name must contain characters')
    }
    await this.dbWriter<UserEntity>(UserEntity.table)
      .update({ display_name: displayName })
      .where({ id: userId })
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    try {
      await this.findOne({ username })
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

  async isCreator(userId: string) {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: userId, is_creator: true })
      .select('id')
      .first()
    return !!user
  }

  async getIdFromUsername(username: string) {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ username })
      .select('id')
      .first()
    return user ? user.id : ''
  }

  async getUsernameFromId(userId: string) {
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: userId })
      .select('username')
      .first()
    return user ? user.username : ''
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
      .select('id', 'username', 'display_name')
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
      .limit(CREATOR_SEARCH_LIMIT)

    return new SearchCreatorResponseDto(creators)
  }

  async featuredCreators(): Promise<SearchCreatorResponseDto> {
    const creators = await this.dbReader<UserEntity>(UserEntity.table)
      .select('id', 'username', 'display_name')
      .where({ featured: true })
      .andWhere({
        is_creator: true,
        is_active: true,
      })
      .limit(CREATOR_SEARCH_LIMIT)

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
        .insert([
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
          {
            user_id: userId,
            name: `Top ${NUMBER_OF_TOP_SPENDERS} Spenders`,
            type: ListTypeEnum.TOP_SPENDERS,
          },
        ])
        .onConflict()
        .ignore()
    })
  }
}
