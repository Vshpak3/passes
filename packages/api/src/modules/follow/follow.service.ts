import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry'
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
import { rejectIfAny } from '../../util/promise.util'
import { CommentEntity } from '../comment/entities/comment.entity'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { FanWallCommentEntity } from '../fan-wall/entities/fan-wall-comment.entity'
import { ListMemberDto } from '../list/dto/list-member.dto'
import { ListMemberEntity } from '../list/entities/list-member.entity'
import { createGetMemberQuery } from '../list/list.util'
import { PaidMessageEntity } from '../messages/entities/paid-message.entity'
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
import { ReportEntity } from './entities/follow-report.entity'
import { WelcomeMessagedEntity } from './entities/welcome-messaged.entity'

export const MAX_FOLLOWERS_PER_REQUEST = 20

@Injectable()
export class FollowService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    @InjectSentry() private readonly sentry: SentryService,

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
      await trx<BlockTaskEntity>(BlockTaskEntity.table).insert({
        follower_id: userId,
        creator_id: creatorId,
      })
    })

    await createOrThrowOnDuplicate(
      () => query,
      this.logger,
      'You cannot follow a creator twice',
    )

    try {
      await this.dbWriter<WelcomeMessagedEntity>(
        WelcomeMessagedEntity.table,
      ).insert({
        follower_id: userId,
        creator_id: creatorId,
      })
      if (creatorSettings?.welcome_message) {
        const welcomeMessage = await this.messagesService.getWelcomeMessage(
          creatorId,
        )
        if (welcomeMessage.paidMessageId) {
          const channel = await this.messagesService.createChannel(userId, {
            userId: creatorId,
          })
          await this.messagesService.createMessage(
            false,
            creatorId,
            welcomeMessage.text,
            channel.channelId,
            userId,
            0,
            false,
            JSON.stringify(welcomeMessage.bareContents),
            welcomeMessage.previewIndex,
            welcomeMessage.price,
            welcomeMessage.paidMessageId,
          )
          await this.dbWriter<PaidMessageEntity>(PaidMessageEntity.table)
            .increment('sent_to', 1)
            .where('id', welcomeMessage.paidMessageId)
        }
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
        `${FollowEntity.table}.created_at`,
      )
      .andWhere(`${FollowEntity.table}.creator_id`, userId)
    if (searchFanDto.excludeListId) {
      query = query.whereNotIn(
        `${FollowEntity.table}.follower_id`,
        this.dbWriter<ListMemberEntity>(ListMemberEntity.table)
          .where('list_id', searchFanDto.excludeListId)
          .select('user_id'),
      )
    }

    query = createGetMemberQuery(query, searchFanDto, FollowEntity.table).limit(
      MAX_FOLLOWERS_PER_REQUEST,
    )

    const followResult = await query

    return followResult.map((follow) => {
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
        `${FollowEntity.table}.created_at`,
      )
      .andWhere(`${FollowEntity.table}.follower_id`, userId)

    query = createGetMemberQuery(
      query,
      searchFollowingDto,
      FollowEntity.table,
    ).limit(MAX_FOLLOWERS_PER_REQUEST)

    const followResult = await query
    return followResult.map((follow) => {
      return new ListMemberDto(follow)
    })
  }

  async reportUser(
    reporterId: string,
    reporteeId: string,
    reason: string,
  ): Promise<void> {
    await this.dbWriter<ReportEntity>(ReportEntity.table).insert({
      id: uuid.v4(),
      reporter_id: reporterId,
      reportee_id: reporteeId,
      reason: reason,
    })
  }

  async blockFollower(creatorId: string, followerId: string): Promise<void> {
    if (creatorId === followerId) {
      throw new BadRequestException('You cannot block yourself')
    }
    const query = this.dbWriter<FollowBlockEntity>(
      FollowBlockEntity.table,
    ).insert({
      creator_id: creatorId,
      follower_id: followerId,
    })
    await createOrThrowOnDuplicate(
      () => query,
      this.logger,
      'You cannot block a creator twice',
    )
    await this.dbWriter<BlockTaskEntity>(BlockTaskEntity.table).insert({
      follower_id: followerId,
      creator_id: creatorId,
    })
    await this.unfollowCreator(followerId, creatorId)
  }

  async unblockFollower(creatorId: string, followerId: string): Promise<void> {
    if (creatorId === followerId) {
      throw new BadRequestException('You cannot unblock yourself')
    }
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
      const blocked = !!tasks[i].blocked
      users.add(tasks[i].follower_id)
      await this.dbWriter<PostEntity>(PostEntity.table)
        .leftJoin(
          CommentEntity.table,
          `${CommentEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        )
        .where(`${PostEntity.table}.user_id`, tasks[i].creator_id)
        .andWhere(`${CommentEntity.table}.commenter_id`, tasks[i].follower_id)
        .update({ blocked })
      await this.dbWriter<FanWallCommentEntity>(FanWallCommentEntity.table)
        .where({
          creator_id: tasks[i].creator_id,
          commenter_id: tasks[i].follower_id,
        })
        .update({ blocked })
    }
    const comments = await this.dbReader<CommentEntity>(CommentEntity.table)
      .whereIn('commenter_id', Array.from(users))
      .distinct('post_id')
    rejectIfAny(
      await Promise.allSettled(
        comments.map(async (comment) => {
          try {
            await this.postService.refreshPostCounts(comment.post_id)
          } catch (err) {
            this.logger.error(
              `Error updating post counts for ${comment.post_id}`,
              err,
            )
            this.sentry.instance().captureException(err)
          }
        }),
      ),
    )

    // reset counts of all posts that any blocked or unblocked user has commented on
    await this.dbWriter<BlockTaskEntity>(BlockTaskEntity.table)
      .where(`${BlockTaskEntity.table}.created_at`, '<', now)
      .delete()
  }
}
