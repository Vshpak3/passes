import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { UserEntity } from '../user/entities/user.entity'
import {
  PROFILE_NOT_EXIST,
  PROFILE_NOT_OWNED_BY_USER,
  USER_HAS_PROFILE,
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
  table: string
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {
    this.table = this.ReadWriteDatabaseService.getTableName(ProfileEntity)
  }

  async create(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<GetProfileDto> {
    const { knex, toDict, v4 } = this.ReadOnlyDatabaseService
    const id = v4()
    const data = toDict(ProfileEntity, {
      id,
      isActive: true,
      user: userId,
      ...createProfileDto,
    })

    const query = () => knex(this.table).insert(data)
    await createOrThrowOnDuplicate(query, USER_HAS_PROFILE)
    return new GetProfileDto(data)
  }

  async findOne(id: string): Promise<GetProfileDto> {
    const { knex } = this.ReadOnlyDatabaseService
    const profile = await knex(this.table).where({ id }).first()
    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    return new GetProfileDto(profile)
  }

  async findOneByUsername(username: string): Promise<GetProfileDto> {
    const { knex, populate, getTableName } = this.ReadOnlyDatabaseService
    const userTable = getTableName(UserEntity)
    const profile = await knex(this.table)
      .innerJoin(`${userTable} as user`, `${this.table}.user_id`, 'user.id')
      .where('user.user_name', username)
      .select([
        `${this.table}.id as id`,
        ...populate(ProfileEntity, [
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
    const { knex, toDict } = this.ReadWriteDatabaseService
    const profile = await knex(this.table).where('id', profileId).first()

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    if (profile.user_id !== userId) {
      throw new ForbiddenException(PROFILE_NOT_OWNED_BY_USER)
    }

    const data = toDict(ProfileEntity, updateProfileDto)

    await knex(this.table).update(data).where('id', profileId)

    return new GetProfileDto({ ...profile, ...data })
  }

  async remove(userId: string, profileId: string): Promise<GetProfileDto> {
    const { knex, toDict } = this.ReadWriteDatabaseService
    const profile = await knex(this.table).where({ id: profileId }).first()
    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_EXIST)
    }

    if (profile.user_id !== userId) {
      throw new ForbiddenException(PROFILE_NOT_OWNED_BY_USER)
    }

    const data = toDict(ProfileEntity, { isActive: false })

    await knex(this.table).update(data).where({ id: profileId })
    return new GetProfileDto({ ...profile, ...data })
  }

  async getAllUsernames(): Promise<GetUsernamesDto> {
    const { knex, getTableName } = this.ReadOnlyDatabaseService
    const userTable = getTableName(UserEntity)
    const rawUsernames = await knex(this.table)
      .innerJoin(`${userTable} as user`, `${this.table}.user_id`, 'user.id')
      .where('user.is_creator', true)
      .select('user.user_name')

    const usernames = rawUsernames.map((u) => u.user_name)

    return {
      usernames,
    }
  }
}
