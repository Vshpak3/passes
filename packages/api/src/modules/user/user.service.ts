import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { generateFromEmail } from 'unique-username-generator'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { VerifyEmailRequestEntity } from '../email/entities/verify-email-request.entity'
import { ListEntity } from '../list/entities/list.entity'
import { ListTypeEnum } from '../list/enum/list.type.enum'
import { USERNAME_TAKEN } from './constants/errors'
import { SetInitialUserInfoRequestDto } from './dto/init-user.dto'
import { SearchCreatorRequestDto } from './dto/search-creator.dto'
import { VerifyEmailDto } from './dto/verify-email.dto'
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
      id: uuid.v4(),
      email,
      username: generateFromEmail(email, 3),
      oauthId: providerId,
      oauthProvider: provider,
    })
    await this.dbWriter(UserEntity.table).insert(data)

    // TODO: fix this cast
    return data as UserEntity
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.dbReader(UserEntity.table).where({ id }).first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return user
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    const user = await this.dbReader(UserEntity.table)
      .where({ username })
      .first()
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

  async setInitialUserInfo(
    userId: string,
    setInitialUserInfoDto: SetInitialUserInfoRequestDto,
  ): Promise<UserEntity> {
    // TODO: this isn't actually needed if we update the create access token method
    const currentUser = await this.findOne(userId)

    const data = UserEntity.toDict<UserEntity>({
      ...setInitialUserInfoDto,
    })
    await this.dbWriter(UserEntity.table).update(data).where({ id: userId })

    return new UserEntity().instantiate({ ...currentUser, ...data })
  }

  async remove(userId: string): Promise<UserEntity> {
    // TODO: check if user query is needed
    const currentUser = await this.findOne(userId)

    const data = UserEntity.toDict<UserEntity>({
      isDisabled: true,
    })
    await this.dbWriter(UserEntity.table).update(data).where({ id: userId })
    return new UserEntity().instantiate({ ...currentUser, ...data })
  }

  // TODO: Sort by creators that the user follows, most interacted with first?
  async searchByQuery(searchCreatorDto: SearchCreatorRequestDto) {
    const strippedQuery = searchCreatorDto.query.replace(/\W/g, '')
    const likeClause = `%${strippedQuery}%`
    return await this.dbReader(UserEntity.table)
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
      .limit(10)
  }

  async validateUsername(username: string): Promise<boolean> {
    const user = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ username }))
      .first()
    return !user
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

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const request = await this.dbReader(VerifyEmailRequestEntity.table)
      .where({ id: verifyEmailDto.verificationToken })
      .first()

    if (!request) {
      throw new BadRequestException('Verify email request does not exist')
    }

    if (Date.now() < request.expires_at) {
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
