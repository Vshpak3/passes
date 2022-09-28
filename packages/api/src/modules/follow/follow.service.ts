// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { CommentEntity } from '../comment/entities/comment.entity'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { ListMemberDto } from '../list/dto/list-member.dto'
import { createGetMemberQuery } from '../list/list.util'
import { MessagesService } from '../messages/messages.service'
import { PostEntity } from '../post/entities/post.entity'
import { PostService } from '../post/post.service'
import { UserEntity } from '../user/entities/user.entity'
import {
  CREATOR_NOT_EXIST,
  FOLLOWER_NOT_EXIST,
  IS_NOT_CREATOR,
} from './constants/errors'
import { FollowDto } from './dto/follow.dto'
import { IsFollowingDto } from './dto/is-following.dto'
import { SearchFollowRequestDto } from './dto/search-follow.dto'
import { BlockTaskEntity } from './entities/block-task.entity'
import { FollowEntity } from './entities/follow.entity'
import { FollowBlockEntity } from './entities/follow-block.entity'
import { FollowReportEntity } from './entities/follow-report.entity'
import { WelcomeMessaged } from './entities/welcome-messaged.entity'

export const MAX_FOLLOWERS_PER_REQUEST = 20

@Injectable()
export class FollowService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
    private readonly postService: PostService,
  ) {}

  async checkFollow(
    userId: string,
    creatorId: string,
  ): Promise<IsFollowingDto> {
    const isFollowing = !!(await this.dbReader<FollowEntity>(FollowEntity.table)
      .where({
        follower_id: userId,
        creator_id: creatorId,
      })
      .select('id')
      .first())

    return new IsFollowingDto(isFollowing)
  }

  async followCreator(userId: string, creatorId: string): Promise<FollowDto> {
    const [follower, creator, creatorSettings] = await Promise.all([
      this.dbReader<UserEntity>(UserEntity.table).where({ id: userId }).first(),
      this.dbReader<UserEntity>(UserEntity.table)
        .where({ id: creatorId })
        .first(),
      this.dbReader<CreatorSettingsEntity>(CreatorSettingsEntity.table)
        .where({ user_id: creatorId })
        .first(),
    ])
    if (
      await this.dbReader<FollowBlockEntity>(FollowBlockEntity.table)
        .where({
          follower_id: userId,
          creator_id: creatorId,
        })
        .select('id')
        .first()
    ) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }
    if (!follower) {
      throw new BadRequestException(FOLLOWER_NOT_EXIST)
    }

    if (!creator) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }

    if (!creator.is_creator) {
      throw new BadRequestException(IS_NOT_CREATOR)
    }

    const data = {
      follower_id: userId,
      creator_id: creatorId,
    } as FollowEntity

    const query = this.dbWriter.transaction(async (trx) => {
      await trx<FollowEntity>(FollowEntity.table).insert(data)
      await trx<CreatorStatEntity>(CreatorStatEntity.table)
        .where({ user_id: creatorId })
        .increment('num_followers', 1)
      await trx<UserEntity>(UserEntity.table)
        .where({ id: userId })
        .increment('num_following', 1)
      await trx<UserEntity>(UserEntity.table)
        .where({ id: userId })
        .increment('num_following', 1)
      await trx<BlockTaskEntity>(BlockTaskEntity.table).insert({
        follower_id: userId,
        creator_id: creatorId,
      })
    })

    await createOrThrowOnDuplicate(
      () => query,
      this.logger,
      'cant follow a creator twice',
    )

    try {
      if (
        creatorSettings?.welcome_message &&
        creatorSettings.welcome_message != ''
      ) {
        await this.dbWriter<WelcomeMessaged>(WelcomeMessaged.table).insert({
          follower_id: userId,
          creator_id: creatorId,
        })
        const channel = await this.messagesService.createChannel(userId, {
          userId: creatorId,
        })
        await this.messagesService.createMessage(
          creator.id,
          creatorSettings.welcome_message,
          channel.channelId,
          0,
          false,
        )
      }
    } catch (err) {
      this.logger.error('failed to send welcome message', err)
    }

    return new FollowDto(data)
  }

  async searchFansByQuery(
    userId: string,
    searchFanDto: SearchFollowRequestDto,
  ): Promise<ListMemberDto[]> {
    let query = this.dbReader<FollowEntity>(FollowEntity.table)
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${FollowEntity.table}.follower_id`,
      )
      .select(
        `${UserEntity.table}.id as user_id`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${FollowEntity.table}.id as follow`,
      )
      .andWhere(`${FollowEntity.table}.creator_id`, userId)

    query = createGetMemberQuery(query, searchFanDto, FollowEntity.table).limit(
      MAX_FOLLOWERS_PER_REQUEST,
    )

    const followResult = await query

    const index = followResult.findIndex(
      (follow) => follow.follow === searchFanDto.lastId,
    )

    return followResult.slice(index + 1).map((follow) => {
      return new ListMemberDto(follow)
    })
  }

  async searchFollowingByQuery(
    userId: string,
    searchFollowingDto: SearchFollowRequestDto,
  ): Promise<ListMemberDto[]> {
    let query = this.dbReader<FollowEntity>(FollowEntity.table)
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${FollowEntity.table}.creator_id`,
      )
      .select(
        `${UserEntity.table}.id as user_id`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${FollowEntity.table}.id as follow`,
      )
      .andWhere(`${FollowEntity.table}.follower_id`, userId)

    query = createGetMemberQuery(
      query,
      searchFollowingDto,
      FollowEntity.table,
    ).limit(MAX_FOLLOWERS_PER_REQUEST)

    const followResult = await query
    const index = followResult.findIndex(
      (follow) => follow.follow === searchFollowingDto.lastId,
    )

    return followResult.slice(index + 1).map((follow) => {
      return new ListMemberDto(follow)
    })
  }

  async reportFollower(
    creatorId: string,
    followerId: string,
    reason: string,
  ): Promise<void> {
    await this.dbWriter<FollowReportEntity>(FollowReportEntity.table).insert({
      id: uuid.v4(),
      creator_id: creatorId,
      follower_id: followerId,
      reason: reason,
    })
  }

  async blockFollower(creatorId: string, followerId: string): Promise<void> {
    const query = this.dbWriter<FollowBlockEntity>(
      FollowBlockEntity.table,
    ).insert({
      creator_id: creatorId,
      follower_id: followerId,
    })
    await createOrThrowOnDuplicate(
      () => query,
      this.logger,
      'cant follow a creator twice',
    )
    await this.dbWriter<BlockTaskEntity>(BlockTaskEntity.table).insert({
      follower_id: followerId,
      creator_id: creatorId,
    })
    await this.unfollowCreator(followerId, creatorId)
  }

  async unblockFollower(creatorId: string, followerId: string): Promise<void> {
    await this.dbWriter<FollowBlockEntity>(FollowBlockEntity.table)
      .where(`${FollowBlockEntity.table}.creator_id`, creatorId)
      .where(`${FollowBlockEntity.table}.follower_id`, followerId)
      .delete()
    await this.dbWriter<BlockTaskEntity>(BlockTaskEntity.table).insert({
      follower_id: followerId,
      creator_id: creatorId,
    })
  }

  async unfollowCreator(userId: string, creatorId: string): Promise<void> {
    await this.dbWriter.transaction(async (trx) => {
      const deleted = await trx<FollowEntity>(FollowEntity.table)
        .where({
          follower_id: userId,
          creator_id: creatorId,
        })
        .delete()
      if (deleted === 1) {
        await trx<CreatorStatEntity>(CreatorStatEntity.table)
          .where({ user_id: creatorId })
          .decrement('num_followers', 1)
        await trx<UserEntity>(UserEntity.table)
          .where({ id: userId })
          .decrement('num_following', 1)
      }
    })
  }

  async getBlocked(userId: string) {
    const query = this.dbReader<FollowBlockEntity>(FollowBlockEntity.table)
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${FollowBlockEntity.table}.follower_id`,
      )
      .select(
        `${UserEntity.table}.id as user_id`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
      )
      .andWhere(`${FollowBlockEntity.table}.creator_id`, userId)

    const blockedResult = await query.orderBy(
      `${UserEntity.table}.display_name`,
      'asc',
    )

    return blockedResult.map((blocked) => {
      return new ListMemberDto(blocked)
    })
  }

  async processBlocks() {
    await this.dbWriter<FollowEntity>(FollowEntity.table)
      .innerJoin(FollowBlockEntity.table, function () {
        this.on(
          `${FollowEntity.table}.follower_id`,
          `${FollowBlockEntity.table}.follower_id`,
        ).andOn(
          `${FollowEntity.table}.creator_id`,
          `${FollowBlockEntity.table}.creator_id`,
        )
      })
      .delete()
    const now = new Date()
    const tasks = await this.dbWriter<BlockTaskEntity>(BlockTaskEntity.table)
      .leftJoin(FollowBlockEntity.table, function () {
        this.on(
          `${BlockTaskEntity.table}.follower_id`,
          `${FollowBlockEntity.table}.follower_id`,
        ).andOn(
          `${BlockTaskEntity.table}.creator_id`,
          `${FollowBlockEntity.table}.creator_id`,
        )
      })
      .where(`${BlockTaskEntity.table}.created_at`, '<', now)
      .distinct([
        `${BlockTaskEntity.table}.follower_id`,
        `${BlockTaskEntity.table}.creator_id`,
      ])
      .select(`${FollowBlockEntity.table}.id as blocked`)

    const users = new Set<string>()
    for (let i = 0; i < tasks.length; ++i) {
      const blocked = tasks[i].blocked
      users.add(tasks[i].follower_id)
      await this.dbWriter<PostEntity>(PostEntity.table)
        .leftJoin(
          CommentEntity.table,
          `${CommentEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        )
        .where(`${PostEntity.table}.user_id`, tasks[i].creator_id)
        .andWhere(`${CommentEntity.table}.commentor_id`, tasks[i].follower_id)
        .update({ blocked: blocked })
    }
    const comments = await this.dbReader<CommentEntity>(CommentEntity.table)
      .whereIn('commentor_id', Array.from(users))
      .distinct('post_id')
    await Promise.all(
      comments.map(async (comment) => {
        try {
          await this.postService.refreshPostCounts(comment.post_id)
        } catch (err) {
          this.logger.error(
            `Error updating post counts for ${comment.post_id}`,
            err,
          )
        }
      }),
    )

    // reset counts of all posts that any blocked or unblocked user has commented on
    await this.dbWriter<BlockTaskEntity>(BlockTaskEntity.table)
      .where(`${BlockTaskEntity.table}.created_at`, '<', now)
      .delete()
  }
}
