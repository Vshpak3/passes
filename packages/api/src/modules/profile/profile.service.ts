import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { UserEntity } from '../user/entities/user.entity'
import { PROFILE_NOT_EXIST } from './constants/errors'
import { CreateOrUpdateProfileRequestDto } from './dto/create-or-update-profile.dto'
import { GetProfileRequestDto } from './dto/get-profile.dto'
import { ProfileDto } from './dto/profile.dto'
import { ProfileEntity } from './entities/profile.entity'

@Injectable()
export class ProfileService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async createOrUpdateProfile(
    userId: string,
    createOrUpdateProfileRequestDto: CreateOrUpdateProfileRequestDto,
  ): Promise<boolean> {
    const data = {
      user_id: userId,
      cover_title: createOrUpdateProfileRequestDto.coverTitle,
      cover_description: createOrUpdateProfileRequestDto.coverDescription,
      description: createOrUpdateProfileRequestDto.description,
      discord_username: createOrUpdateProfileRequestDto.discordUsername,
      facebook_username: createOrUpdateProfileRequestDto.facebookUsername,
      instagram_username: createOrUpdateProfileRequestDto.instagramUsername,
      tiktok_username: createOrUpdateProfileRequestDto.tiktokUsername,
      twitch_username: createOrUpdateProfileRequestDto.twitchUsername,
      twitter_username: createOrUpdateProfileRequestDto.twitterUsername,
      youtube_username: createOrUpdateProfileRequestDto.youtubeUsername,
    }

    Object.keys(data).forEach((key) =>
      data[key] === undefined ? delete data[key] : {},
    )

    await this.dbWriter<ProfileEntity>(ProfileEntity.table)
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

    let query = this.dbReader<ProfileEntity>(ProfileEntity.table)
      .innerJoin(
        `${UserEntity.table}`,
        `${ProfileEntity.table}.user_id`,
        `${UserEntity.table}.id`,
      )
      .where(`${ProfileEntity.table}.is_active`, true)
      .where(`${UserEntity.table}.is_creator`, true)
      .where(`${UserEntity.table}.is_active`, true)
      .select(
        `${ProfileEntity.table}.*`,
        `${UserEntity.table}.display_name`,
        `${UserEntity.table}.is_adult`,
        `${UserEntity.table}.is_creator`,
      )
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
      const followBlockResult = await this.dbReader<FollowBlockEntity>(
        FollowBlockEntity.table,
      )
        .where(`${FollowBlockEntity.table}.follower_id`, userId)
        .where(`${FollowBlockEntity.table}.creator_id`, profile.user_id)
        .first()

      if (followBlockResult) {
        throw new BadRequestException(PROFILE_NOT_EXIST)
      }
    }

    return new ProfileDto(profile)
  }

  async deactivateProfile(userId: string): Promise<boolean> {
    const updated = await this.dbWriter<ProfileEntity>(ProfileEntity.table)
      .update({ is_active: false })
      .where({ user_id: userId, is_active: true })
    return updated === 1
  }

  async activateProfile(userId: string): Promise<boolean> {
    const updated = await this.dbWriter<ProfileEntity>(ProfileEntity.table)
      .update({ is_active: true })
      .where({ user_id: userId, is_active: false })
    return updated === 1
  }

  async isProfileActive(userId: string): Promise<boolean> {
    const status = await this.dbReader<ProfileEntity>(ProfileEntity.table)
      .where({ user_id: userId })
      .select('is_active')
      .first()
    return !!status && status.is_active
  }
}
