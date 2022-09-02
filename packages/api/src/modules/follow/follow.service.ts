// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { MessagesService } from '../messages/messages.service'
import { ProfileEntity } from '../profile/entities/profile.entity'
import { UserEntity } from '../user/entities/user.entity'
import {
  CREATOR_NOT_EXIST,
  FOLLOWER_NOT_EXIST,
  FOLLOWING_NOT_EXIST,
  IS_NOT_CREATOR,
} from './constants/errors'
import { FollowDto } from './dto/follow.dto'
import { GetFanResponseDto } from './dto/get-fan.dto'
import { SearchFanRequestDto } from './dto/search-fan.dto'
import { FollowEntity } from './entities/follow.entity'
import { FollowBlockEntity } from './entities/follow-block.entity'
import { FollowReportEntity } from './entities/follow-report.entity'
import { FollowRestrictEntity } from './entities/follow-restrict.entity'

// TODO: Use CASL to determine if user can access an entity
// See https://docs.nestjs.com/security/authorization#integrating-casl
@Injectable()
export class FollowService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],

    private readonly messagesService: MessagesService,
  ) {}

  async checkFollow(userId: string, creatorId: string): Promise<boolean> {
    return !!(await this.dbReader(FollowEntity.table)
      .where(
        FollowEntity.toDict<FollowEntity>({
          follower: userId,
          creator: creatorId,
          isActive: true,
        }),
      )
      .select('id')
      .first())
  }

  async followCreator(userId: string, creatorId: string): Promise<FollowDto> {
    const [follower, creator, creatorSettings] = await Promise.all([
      this.dbReader(UserEntity.table).where({ id: userId }).first(),
      this.dbReader(UserEntity.table).where({ id: creatorId }).first(),
      this.dbReader(CreatorSettingsEntity.table)
        .where({
          user_id: creatorId,
        })
        .first(),
    ])
    if (!follower) {
      throw new BadRequestException(FOLLOWER_NOT_EXIST)
    }

    if (!creator) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }

    if (!creator.is_creator) {
      throw new BadRequestException(IS_NOT_CREATOR)
    }

    if (
      creatorSettings?.welcomeMessage &&
      creatorSettings.welcomeMessage != ''
    ) {
      const channel = await this.messagesService.createChannel(userId, {
        text: '',
        username: creator.username,
      })
      await this.messagesService.sendMessage(creator.id, {
        text: creatorSettings.welcomeMessage,
        attachments: [],
        content: [],
        channelId: channel.id,
      })
    }

    const data = FollowEntity.toDict<FollowEntity>({
      follower: userId,
      creator: creatorId,
      isActive: false,
    })

    await this.dbWriter.transaction(async (trx) => {
      await trx(FollowEntity.table)
        .insert(data)
        .onConflict(['follower_id', 'creator_id'])
        .ignore()
      const updated = await trx(FollowEntity.table)
        .where(
          FollowEntity.toDict<FollowEntity>({
            follower: userId,
            creator: creatorId,
            isActive: false,
          }),
        )
        .update('is_active', true)
      if (updated === 1) {
        await trx(CreatorStatEntity.table)
          .where('user_id', userId)
          .increment('num_followers', 1)
      }
    })
    return new FollowDto(data)
  }

  async searchByQuery(
    userId: string,
    searchFanDto: SearchFanRequestDto,
  ): Promise<GetFanResponseDto[]> {
    const strippedQuery = searchFanDto.query.replace(/\W/g, '')
    const likeClause = `%${strippedQuery}%`
    const query = this.dbReader(FollowEntity.table)
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${FollowEntity.table}.follower_id`,
      )
      .leftJoin(
        ProfileEntity.table,
        `${ProfileEntity.table}.user_id`,
        `${FollowEntity.table}.follower_id`,
      )
      .select(
        `${UserEntity.table}.id`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${ProfileEntity.table}.profile_image_url`,
      )
      .where(async function () {
        await this.whereILike('user.username', likeClause).orWhereILike(
          'user.display_name',
          likeClause,
        )
      })
      .andWhere(`${FollowEntity.table}.creator_id`, userId)
      .andWhere(`${FollowEntity.table}.is_active`, true)

    if (searchFanDto.cursor) {
      await query.andWhere(
        this.dbReader.raw(`user.id > ${searchFanDto.cursor}`),
      )
    }

    const followResult = await query
      .orderBy('user.display_name', 'asc')
      .limit(50)

    return followResult.map((follow) => {
      return new GetFanResponseDto(
        follow.id,
        follow.username,
        follow.display_name,
        follow.profile_image_url,
      )
    })
  }

  async findOne(id: string): Promise<FollowDto> {
    const following = await this.dbReader(FollowEntity.table)
      .where({ id })
      .first()
    if (!following) {
      throw new NotFoundException(FOLLOWING_NOT_EXIST)
    }

    return new FollowDto(following)
  }

  async reportFollower(
    creatorId: string,
    followerId: string,
    reason: string,
  ): Promise<void> {
    await this.dbWriter(FollowReportEntity.table).insert(
      FollowReportEntity.toDict({
        id: uuid.v4(),
        creator: creatorId,
        follower: followerId,
        reason: reason,
      }),
    )
  }

  async restrictFollower(creatorId: string, followerId: string): Promise<void> {
    await this.dbWriter(FollowRestrictEntity.table).insert(
      FollowRestrictEntity.toDict({
        creator: creatorId,
        follower: followerId,
      }),
    )
  }

  async unrestrictFollower(
    creatorId: string,
    followerId: string,
  ): Promise<void> {
    await this.dbWriter(FollowRestrictEntity.table)
      .where(`${FollowRestrictEntity.table}.creator_id`, creatorId)
      .where(`${FollowRestrictEntity.table}.follower_id`, followerId)
      .delete()
  }

  async blockFollower(creatorId: string, followerId: string): Promise<void> {
    await this.dbWriter(FollowBlockEntity.table).insert(
      FollowBlockEntity.toDict({
        creator: creatorId,
        follower: followerId,
      }),
    )
  }

  async unblockFollower(creatorId: string, followerId: string): Promise<void> {
    await this.dbWriter(FollowBlockEntity.table)
      .where(`${FollowBlockEntity.table}.creator_id`, creatorId)
      .where(`${FollowBlockEntity.table}.follower_id`, followerId)
      .delete()
  }

  async unfollowCreator(userId: string, creatorId: string): Promise<void> {
    await this.dbWriter.transaction(async (trx) => {
      const updated = await trx(FollowEntity.table)
        .update(FollowEntity.toDict<FollowEntity>({ isActive: false }))
        .where(
          FollowEntity.toDict<FollowEntity>({
            follower: userId,
            creator: creatorId,
            isActive: true,
          }),
        )
      if (updated === 1) {
        await trx(CreatorStatEntity.table)
          .where('user_id', userId)
          .decrement('num_followers', 1)
      }
    })
  }
}
