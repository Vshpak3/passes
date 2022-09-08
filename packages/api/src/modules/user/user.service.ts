import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { generateFromEmail } from 'unique-username-generator'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { OAuthProvider } from '../auth/helpers/oauth-provider.type'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { VerifyEmailRequestEntity } from '../email/entities/verify-email-request.entity'
import { ListEntity } from '../list/entities/list.entity'
import { ListTypeEnum } from '../list/enum/list.type.enum'
import { USERNAME_TAKEN } from './constants/errors'
import { SetInitialUserInfoRequestDto } from './dto/init-user.dto'
import {
  SearchCreatorRequestDto,
  SearchCreatorResponseDto,
} from './dto/search-creator.dto'
import { UserDto } from './dto/user.dto'
import { VerifyEmailDto } from './dto/verify-email.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  env: string

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
    private readonly jwtAuthService: JwtAuthService,
  ) {
    this.env = configService.get('infra.env') as string
  }

  async createOAuthUser(
    email: string,
    provider: OAuthProvider,
    providerId: string,
  ): Promise<UserDto> {
    const data = UserEntity.toDict<UserEntity>({
      id: uuid.v4(),
      email,
      username: generateFromEmail(email, 3),
      oauthId: providerId,
      oauthProvider: provider,
      isEmailVerified: !!email,
    })
    await this.dbWriter(UserEntity.table).insert(data)
    return new UserDto(data)
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.dbReader(UserEntity.table).where({ id }).first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return new UserDto(user)
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    const user = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ username }))
      .first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return new UserDto(user)
  }

  async findOneByOAuth(
    oauthId: string,
    oauthProvider: OAuthProvider,
  ): Promise<UserDto | undefined> {
    const user = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ oauthId, oauthProvider }))
      .first()
    return user ? new UserDto(user) : undefined
  }

  async setInitialUserInfo(
    userId: string,
    setInitialUserInfoDto: SetInitialUserInfoRequestDto,
  ): Promise<UserDto> {
    const user = await this.findOne(userId)

    if (this.jwtAuthService.isVerified(user)) {
      throw new BadRequestException('Already set initial info')
    }

    await this.dbWriter(UserEntity.table)
      .update(
        UserEntity.toDict<UserEntity>({
          ...setInitialUserInfoDto,
        }),
      )
      .where({ id: userId })

    // Double check that the user is now verified
    if (!this.jwtAuthService.isVerified(user)) {
      throw new InternalServerErrorException(
        'User is not verified but should be',
      )
    }

    return user.override(setInitialUserInfoDto)
  }

  async setEmail(userId: string, email: string): Promise<UserDto> {
    const user = await this.findOne(userId)

    // Block endpoint if verified. Do not block if only the email is set
    // (since the user may have entered the wrong email)
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already set')
    }

    // TODO: Connect this to send an email for staging and production
    if (this.env === 'dev' || this.env === 'stage') {
      const update = {
        email,
        isEmailVerified: true,
      }

      await this.dbWriter(UserEntity.table)
        .update(UserEntity.toDict<UserEntity>(update))
        .where({ id: userId })

      return user.override(update)
    }

    return user
  }

  async setUsername(userId: string, username: string): Promise<void> {
    const query = () =>
      this.dbWriter(UserEntity.table)
        .update(
          UserEntity.toDict<UserEntity>({
            username,
          }),
        )
        .where({ id: userId })
    await createOrThrowOnDuplicate(query, this.logger, USERNAME_TAKEN)
  }

  async validateUsername(username: string): Promise<boolean> {
    try {
      await this.findOneByUsername(username)
      return true
    } catch (err) {
      return false
    }
  }

  async disableUser(userId: string): Promise<void> {
    await this.dbWriter(UserEntity.table)
      .update(
        UserEntity.toDict<UserEntity>({
          isDisabled: true,
        }),
      )
      .where({ id: userId })
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
            isDisabled: false,
          }),
        )
        .limit(10),
    )
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

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    const request = await this.dbReader(VerifyEmailRequestEntity.table)
      .where({ id: verifyEmailDto.verificationToken })
      .first()

    if (!request) {
      throw new BadRequestException('Verify email request does not exist')
    }

    if (new Date() < request.expires_at) {
      throw new BadRequestException('Verify email request has already expired')
    }

    if (request.used_at !== null) {
      throw new BadRequestException(
        'Verify email request has already been used',
      )
    }

    const data = VerifyEmailRequestEntity.toDict<VerifyEmailRequestEntity>({
      usedAt: new Date(),
    })

    await this.dbWriter.transaction(async (trx) => {
      await trx(VerifyEmailRequestEntity.table)
        .update(data)
        .where({ id: verifyEmailDto.verificationToken })

      await trx(UserEntity.table)
        .where('id', request.user_id)
        .update('is_email_verified', true)
    })
  }
}
