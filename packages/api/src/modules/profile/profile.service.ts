import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { UserEntity } from '../user/entities/user.entity'
import {
  PROFILE_NOT_EXIST,
  PROFILE_NOT_OWNED_BY_USER,
  USER_HAS_PROFILE,
  USER_IS_NOT_CREATOR,
} from './constants/errors'
import { CreateProfileDto } from './dto/create-profile.dto'
import { GetProfileDto } from './dto/get-profile.dto'
import { GetUsernamesDto } from './dto/get-usernames.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ProfileEntity } from './entities/profile.entity'

// TODO: Use CASL to determine if user can access an entity
// See https://docs.nestjs.com/security/authorization#integrating-casl
@Injectable()
export class ProfileService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {}

  async create(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<GetProfileDto> {
    const { knex } = this.ReadOnlyDatabaseService

    const user = await knex(UserEntity.table).where({ id: userId }).first()
    if (!user || !user.is_creator) {
      throw new BadRequestException(USER_IS_NOT_CREATOR)
    }

    const data = ProfileEntity.toDict<ProfileEntity>({
      isActive: true,
      user: userId,
      ...createProfileDto,
    })

    const query = () => knex(ProfileEntity.table).insert(data)
    await createOrThrowOnDuplicate(query, this.logger, USER_HAS_PROFILE)
    return new GetProfileDto(data)
  }

  async findOne(id: string): Promise<GetProfileDto> {
    const { knex } = this.ReadOnlyDatabaseService
    const profile = await knex(ProfileEntity.table)
      .innerJoin(
        `${UserEntity.table}`,
        `${ProfileEntity.table}.user_id`,
        `${UserEntity.table}.id`,
      )
      .where(`${ProfileEntity.table}.id`, id)
      .where(`${ProfileEntity.table}.is_active`, true)
      .where(`${UserEntity.table}.is_creator`, true)
      .first()

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    return new GetProfileDto(profile)
  }

  async findOneByUsername(username: string): Promise<GetProfileDto> {
    const { knex } = this.ReadOnlyDatabaseService
    const profile = await knex(ProfileEntity.table)
      .innerJoin(
        `${UserEntity.table} as user`,
        `${ProfileEntity.table}.user_id`,
        `user.id`,
      )
      .where(`${ProfileEntity.table}.is_active`, true)
      .where('user.username', username)
      .where('user.is_creator', true)
      .select([
        `${ProfileEntity.table}.id as id`,
        ...ProfileEntity.populate<ProfileEntity>([
          'user',
          'description',
          'profileImageUrl',
          'instagramUrl',
          'tiktokUrl',
          'youtubeUrl',
          'discordUrl',
          'twitchUrl',
          'isActive',
        ]),
      ])
      .first()
    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    return new GetProfileDto(profile)
  }

  async update(
    userId: string,
    profileId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<GetProfileDto> {
    const { knex } = this.ReadWriteDatabaseService
    const profile = await knex(ProfileEntity.table)
      .where('id', profileId)
      .first()

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    if (profile.user_id !== userId) {
      throw new ForbiddenException(PROFILE_NOT_OWNED_BY_USER)
    }

    const data = ProfileEntity.toDict<ProfileEntity>(updateProfileDto)

    await knex(ProfileEntity.table).update(data).where('id', profileId)

    return new GetProfileDto({ ...profile, ...data })
  }

  async remove(userId: string, profileId: string): Promise<GetProfileDto> {
    const { knex } = this.ReadWriteDatabaseService
    const profile = await knex(ProfileEntity.table)
      .where({ id: profileId })
      .first()
    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    if (profile.user_id !== userId) {
      throw new ForbiddenException(PROFILE_NOT_OWNED_BY_USER)
    }

    const data = ProfileEntity.toDict<ProfileEntity>({ isActive: false })

    await knex(ProfileEntity.table).update(data).where({ id: profileId })
    return new GetProfileDto({ ...profile, ...data })
  }

  async getAllUsernames(): Promise<GetUsernamesDto> {
    const { knex } = this.ReadOnlyDatabaseService
    const rawUsernames = await knex(ProfileEntity.table)
      .innerJoin(
        `${UserEntity.table} as user`,
        `${ProfileEntity.table}.user_id`,
        'user.id',
      )
      .where('user.is_creator', true)
      .select('user.username')

    const usernames = rawUsernames.map((u) => u.username)

    return {
      usernames,
    }
  }
}
