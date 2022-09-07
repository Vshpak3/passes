import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { UserEntity } from '../user/entities/user.entity'
import { PROFILE_NOT_EXIST } from './constants/errors'
import { CreateOrUpdateProfileRequestDto } from './dto/create-or-update-profile.dto'
import { GetProfileRequestDto } from './dto/get-profile.dto'
import { GetUsernamesResponseDto } from './dto/get-usernames.dto'
import { ProfileDto } from './dto/profile.dto'
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

  async createOrUpdateProfile(
    userId: string,
    createOrUpdateProfileRequestDto: CreateOrUpdateProfileRequestDto,
  ): Promise<boolean> {
    const data = ProfileEntity.toDict<ProfileEntity>({
      user: userId,
      isActive: true,
      ...createOrUpdateProfileRequestDto,
    })

    await this.dbWriter(ProfileEntity.table)
      .insert(data)
      .onConflict('user_id')
      .merge()
    return true
  }

  async findProfile(
    getProfileRequestDto: GetProfileRequestDto,
    userId?: string,
  ): Promise<ProfileDto> {
    const { creatorId, username, profileId } = getProfileRequestDto
    if (!(creatorId || username || profileId)) {
      throw new BadRequestException(PROFILE_NOT_EXIST)
    }

    let query = this.dbReader(ProfileEntity.table)
      .innerJoin(
        `${UserEntity.table}`,
        `${ProfileEntity.table}.user_id`,
        `${UserEntity.table}.id`,
      )
      .where(`${ProfileEntity.table}.is_active`, true)
      .where(`${UserEntity.table}.is_creator`, true)
      .first()
    if (creatorId) {
      query = query.andWhere(`${UserEntity.table}.id`, creatorId)
    }
    if (username) {
      query = query.andWhere(`${UserEntity.table}.username`, username)
    }
    if (profileId) {
      query = query.andWhere(`${ProfileEntity.table}.id`, profileId)
    }

    const profile = await query
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

  async removeProfile(userId: string, profileId: string): Promise<boolean> {
    const data = ProfileEntity.toDict<ProfileEntity>({ isActive: false })
    const updated = await this.dbWriter(ProfileEntity.table)
      .update(data)
      .where(
        ProfileEntity.toDict<ProfileEntity>({ id: profileId, user: userId }),
      )
    return updated === 1
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
