// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
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
  FOLLOWING_NOT_EXIST,
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

    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
    private readonly postService: PostService,
  ) {}

  async checkFollow(
    userId: string,
    creatorId: string,
  ): Promise<IsFollowingDto> {
    const isFollowing = !!(await this.dbReader(FollowEntity.table)
      .where(
        FollowEntity.toDict<FollowEntity>({
          follower: userId,
          creator: creatorId,
        }),
      )
      .select('id')
      .first())

    return new IsFollowingDto(isFollowing)
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
    if (
      await this.dbReader(FollowBlockEntity.table)
        .where(
          FollowBlockEntity.toDict<FollowBlockEntity>({
            follower: userId,
            creator: creatorId,
          }),
        )
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

    const data = FollowEntity.toDict<FollowEntity>({
      follower: userId,
      creator: creatorId,
    })

    await this.dbWriter.transaction(async (trx) => {
      await trx(FollowEntity.table).insert(data)
      await trx(CreatorStatEntity.table)
        .where('user_id', creatorId)
        .increment('num_followers', 1)
      await trx(UserEntity.table)
        .where('id', userId)
        .increment('num_following', 1)
      await trx(UserEntity.table)
        .where('id', userId)
        .increment('num_following', 1)
      await trx(BlockTaskEntity.table).insert(
        BlockTaskEntity.toDict<BlockTaskEntity>({
          follower: userId,
          creator: creatorId,
        }),
      )
    })

    try {
      if (
        creatorSettings?.welcomeMessage &&
        creatorSettings.welcomeMessage != ''
      ) {
        await this.dbWriter(WelcomeMessaged.table).insert(
          WelcomeMessaged.toDict<WelcomeMessaged>({
            follower: userId,
            creator: creatorId,
          }),
        )
        const channel = await this.messagesService.getChannel(userId, {
          username: '',
          userId: creatorId,
        })
        await this.messagesService.sendMessage(creator.id, {
          text: creatorSettings.welcomeMessage,
          attachments: [],
          channelId: channel.channelId,
        })
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
    let query = this.dbReader(FollowEntity.table)
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

    return followResult.map((follow) => {
      return new ListMemberDto(follow)
    })
  }

  async searchFollowingByQuery(
    userId: string,
    searchFollowingDto: SearchFollowRequestDto,
  ): Promise<ListMemberDto[]> {
    let query = this.dbReader(FollowEntity.table)
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${FollowEntity.table}.creator_id`,
      )
      .select(
        `${UserEntity.table}.id as user_id`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
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

  async blockFollower(creatorId: string, followerId: string): Promise<void> {
    await this.dbWriter(FollowBlockEntity.table).insert(
      FollowBlockEntity.toDict({
        creator: creatorId,
        follower: followerId,
      }),
    )
    await this.dbWriter(BlockTaskEntity.table).insert(
      BlockTaskEntity.toDict<BlockTaskEntity>({
        follower: followerId,
        creator: creatorId,
      }),
    )
    await this.unfollowCreator(followerId, creatorId)
  }

  async unblockFollower(creatorId: string, followerId: string): Promise<void> {
    await this.dbWriter(FollowBlockEntity.table)
      .where(`${FollowBlockEntity.table}.creator_id`, creatorId)
      .where(`${FollowBlockEntity.table}.follower_id`, followerId)
      .delete()
    await this.dbWriter(BlockTaskEntity.table).insert(
      BlockTaskEntity.toDict<BlockTaskEntity>({
        follower: followerId,
        creator: creatorId,
      }),
    )
  }

  async unfollowCreator(userId: string, creatorId: string): Promise<void> {
    await this.dbWriter.transaction(async (trx) => {
      const deleted = await trx(FollowEntity.table)
        .where(
          FollowEntity.toDict<FollowEntity>({
            follower: userId,
            creator: creatorId,
          }),
        )
        .delete()
      if (deleted === 1) {
        await trx(CreatorStatEntity.table)
          .where('user_id', creatorId)
          .decrement('num_followers', 1)
        await trx(UserEntity.table)
          .where('id', userId)
          .decrement('num_following', 1)
      }
    })
  }

  async getBlocked(userId: string) {
    const query = this.dbReader(FollowBlockEntity.table)
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
    await this.dbWriter(FollowEntity.table)
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
    const tasks = await this.dbWriter(BlockTaskEntity.table)
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
      await this.dbWriter(PostEntity.table)
        .leftJoin(
          CommentEntity.table,
          `${CommentEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        )
        .where(`${PostEntity.table}.user_id`, tasks[i].creator_id)
        .andWhere(`${CommentEntity.table}.commentor_id`, tasks[i].follower_id)
        .update('blocked', blocked)
    }
    const comments = await this.dbReader(CommentEntity.table)
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
    await this.dbWriter(BlockTaskEntity.table)
      .where(`${BlockTaskEntity.table}.created_at`, '<', now)
      .delete()
  }
}
