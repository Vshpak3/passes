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
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { UserEntity } from '../user/entities/user.entity'
import {
  PROFILE_NOT_EXIST,
  PROFILE_NOT_OWNED_BY_USER,
  USER_HAS_PROFILE,
  USER_IS_NOT_CREATOR,
} from './constants/errors'
import { CreateProfileRequestDto } from './dto/create-profile.dto'
import { GetUsernamesResponseDto } from './dto/get-usernames.dto'
import { ProfileDto } from './dto/profile.dto'
import { UpdateProfileRequestDto } from './dto/update-profile.dto'
import { ProfileEntity } from './entities/profile.entity'

// TODO: Use CASL to determine if user can access an entity
// See https://docs.nestjs.com/security/authorization#integrating-casl
@Injectable()
export class ProfileService {
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
    createProfileDto: CreateProfileRequestDto,
  ): Promise<ProfileDto> {
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()
    if (!user || !user.is_creator) {
      throw new BadRequestException(USER_IS_NOT_CREATOR)
    }

    const data = ProfileEntity.toDict<ProfileEntity>({
      isActive: true,
      user: userId,
      ...createProfileDto,
    })

    const query = () => this.dbWriter(ProfileEntity.table).insert(data)
    await createOrThrowOnDuplicate(query, this.logger, USER_HAS_PROFILE)
    return new ProfileDto(data)
  }

  async findOne(id: string, userId?: string): Promise<ProfileDto> {
    const profile = await this.dbReader(ProfileEntity.table)
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

    if (userId) {
      const followBlockResult = await this.dbReader(FollowBlockEntity.table)
        .where(`${FollowBlockEntity.table}.follower_id`, userId)
        .where(`${FollowBlockEntity.table}.creator_id`, profile.user_id)
        .first()

      if (followBlockResult) {
        throw new BadRequestException(PROFILE_NOT_EXIST)
      }
    }

    return new ProfileDto(profile)
  }

  async findOneByUsername(
    username: string,
    userId?: string,
  ): Promise<ProfileDto> {
    const profile = await this.dbReader(ProfileEntity.table)
      .innerJoin(
        `${UserEntity.table} as user`,
        `${ProfileEntity.table}.user_id`,
        `user.id`,
      )
      .where(`${ProfileEntity.table}.is_active`, true)
      .where('user.username', username)
      .where('user.is_creator', true)
      .select(['*', `${ProfileEntity.table}.id as id`])
      .first()
    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    if (userId) {
      const followBlockResult = await this.dbReader(FollowBlockEntity.table)
        .where(`${FollowBlockEntity.table}.follower_id`, userId)
        .where(`${FollowBlockEntity.table}.creator_id`, profile.user_id)
        .first()

      if (followBlockResult) {
        throw new BadRequestException(PROFILE_NOT_EXIST)
      }
    }

    return new ProfileDto(profile)
  }

  async update(
    userId: string,
    profileId: string,
    updateProfileDto: UpdateProfileRequestDto,
  ): Promise<ProfileDto> {
    const profile = await this.dbWriter(ProfileEntity.table)
      .where('id', profileId)
      .first()

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    if (profile.user_id !== userId) {
      throw new ForbiddenException(PROFILE_NOT_OWNED_BY_USER)
    }

    const data = ProfileEntity.toDict<ProfileEntity>(updateProfileDto)

    await this.dbWriter(ProfileEntity.table).update(data).where('id', profileId)

    return new ProfileDto({ ...profile, ...data })
  }

  async remove(userId: string, profileId: string): Promise<ProfileDto> {
    const profile = await this.dbReader(ProfileEntity.table)
      .where({ id: profileId })
      .first()
    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    if (profile.user_id !== userId) {
      throw new ForbiddenException(PROFILE_NOT_OWNED_BY_USER)
    }

    const data = ProfileEntity.toDict<ProfileEntity>({ isActive: false })

    await this.dbWriter(ProfileEntity.table)
      .update(data)
      .where({ id: profileId })
    return new ProfileDto({ ...profile, ...data })
  }

  async getAllUsernames(): Promise<GetUsernamesResponseDto> {
    const rawUsernames = await this.dbWriter(ProfileEntity.table)
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
