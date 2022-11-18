import { BadRequestException, Injectable } from '@nestjs/common'

import { Database, DB_READER } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { OrderEnum } from '../../util/dto/page.dto'
import { createPaginatedQuery } from '../../util/page.util'
import { CREATOR_NOT_EXIST } from '../follow/constants/errors'
import { FollowEntity } from '../follow/entities/follow.entity'
import { PostLikeEntity } from '../likes/entities/like.entity'
import { PostDto } from '../post/dto/post.dto'
import { PostEntity } from '../post/entities/post.entity'
import { PostTipEntity } from '../post/entities/post-tip.entity'
import { PostToCategoryEntity } from '../post/entities/post-to-category.entity'
import { PostUserAccessEntity } from '../post/entities/post-user-access.entity'
import { PostService } from '../post/post.service'
import { UserEntity } from '../user/entities/user.entity'
import { GetFeedRequestDto } from './dto/get-feed-dto'
import { GetProfileFeedRequestDto } from './dto/get-profile-feed.dto'

const MAX_POST_PER_FEED_REQUEST = 5

@Injectable()
export class FeedService {
  constructor(
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],

    private readonly postService: PostService,
  ) {}

  async getAllPosts(
    userId: string,
    getFeedRequestDto: GetFeedRequestDto,
  ): Promise<PostDto[]> {
    const { lastId, createdAt } = getFeedRequestDto
    const dbReader = this.dbReader
    let query = this.dbReader<PostEntity>(PostEntity.table)
      .innerJoin(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${PostEntity.table}.user_id`,
      )
      .leftJoin(PostUserAccessEntity.table, function () {
        this.on(
          `${PostUserAccessEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        ).andOn(
          `${PostUserAccessEntity.table}.user_id`,
          dbReader.raw('?', [userId]),
        )
      })
      .leftJoin(PostTipEntity.table, function () {
        this.on(
          `${PostTipEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        ).andOn(`${PostTipEntity.table}.user_id`, dbReader.raw('?', [userId]))
      })
      .leftJoin(PostLikeEntity.table, function () {
        this.on(
          `${PostEntity.table}.id`,
          `${PostLikeEntity.table}.post_id`,
        ).andOn(`${PostLikeEntity.table}.liker_id`, dbReader.raw('?', [userId]))
      })
      .select([
        `${PostEntity.table}.*`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${PostUserAccessEntity.table}.paid_at as paid_at`,
        `${PostUserAccessEntity.table}.paying as paying`,
        `${PostTipEntity.table}.amount as your_tips`,
        `${PostLikeEntity.table}.id as is_liked`,
      ])
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(function () {
        return this.whereNull(`${PostEntity.table}.expires_at`).orWhere(
          `${PostEntity.table}.expires_at`,
          '>',
          new Date(),
        )
      })
      .andWhere(`${PostEntity.table}.content_processed`, true)
      .limit(MAX_POST_PER_FEED_REQUEST)
    query = createPaginatedQuery(
      query,
      PostEntity.table,
      PostEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    )
    return await this.postService.getPostsFromQuery(userId, query)
  }

  async getFeed(
    userId: string,
    getFeedRequestDto: GetFeedRequestDto,
  ): Promise<PostDto[]> {
    const { lastId, createdAt } = getFeedRequestDto
    const dbReader = this.dbReader
    let query = this.dbReader<FollowEntity>(FollowEntity.table)
      .innerJoin<UserEntity>(
        UserEntity.table,
        `${UserEntity.table}.id`,
        `${FollowEntity.table}.creator_id`,
      )
      .innerJoin(
        PostEntity.table,
        `${FollowEntity.table}.creator_id`,
        `${PostEntity.table}.user_id`,
      )
      .leftJoin(PostUserAccessEntity.table, function () {
        this.on(
          `${PostUserAccessEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        ).andOn(
          `${PostUserAccessEntity.table}.user_id`,
          dbReader.raw('?', [userId]),
        )
      })
      .leftJoin(PostTipEntity.table, function () {
        this.on(
          `${PostTipEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        ).andOn(`${PostTipEntity.table}.user_id`, dbReader.raw('?', [userId]))
      })
      .leftJoin(PostLikeEntity.table, function () {
        this.on(
          `${PostEntity.table}.id`,
          `${PostLikeEntity.table}.post_id`,
        ).andOn(`${PostLikeEntity.table}.liker_id`, dbReader.raw('?', [userId]))
      })
      .select([
        `${PostEntity.table}.*`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${PostUserAccessEntity.table}.paid_at as paid_at`,
        `${PostUserAccessEntity.table}.paying as paying`,
        `${PostTipEntity.table}.amount as your_tips`,
        `${PostLikeEntity.table}.id as is_liked`,
      ])
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(function () {
        return this.whereNull(`${PostEntity.table}.expires_at`).orWhere(
          `${PostEntity.table}.expires_at`,
          '>',
          new Date(),
        )
      })
      .andWhere(`${PostEntity.table}.content_processed`, true)
      .andWhere(`${FollowEntity.table}.follower_id`, userId)
      .limit(MAX_POST_PER_FEED_REQUEST)
    query = createPaginatedQuery(
      query,
      PostEntity.table,
      PostEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    )
    return await this.postService.getPostsFromQuery(userId, query)
  }

  async getFeedForCreator(
    getProfileFeedRequestDto: GetProfileFeedRequestDto,
    userId?: string,
  ): Promise<PostDto[]> {
    if (!userId) {
      userId = ''
    }
    const { creatorId, lastId, createdAt, pinned, postCategoryId } =
      getProfileFeedRequestDto
    const creator = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: creatorId })
      .select(['is_active', 'is_creator'])
      .first()
    if (!creator || !creator.is_active || !creator.is_creator) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }
    const dbReader = this.dbReader
    let query = this.dbReader<UserEntity>(UserEntity.table)
      .innerJoin(
        PostEntity.table,
        `${UserEntity.table}.id`,
        `${PostEntity.table}.user_id`,
      )
      .leftJoin(PostUserAccessEntity.table, function () {
        this.on(
          `${PostUserAccessEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        ).andOn(
          `${PostUserAccessEntity.table}.user_id`,
          dbReader.raw('?', [userId]),
        )
      })
      .leftJoin(PostTipEntity.table, function () {
        this.on(
          `${PostTipEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        ).andOn(`${PostTipEntity.table}.user_id`, dbReader.raw('?', [userId]))
      })
      .leftJoin(PostLikeEntity.table, function () {
        this.on(
          `${PostLikeEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        ).andOn(`${PostLikeEntity.table}.liker_id`, dbReader.raw('?', [userId]))
      })
      .select([
        `${PostEntity.table}.*`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${PostUserAccessEntity.table}.paid_at as paid_at`,
        `${PostUserAccessEntity.table}.paying as paying`,
        `${PostTipEntity.table}.amount as your_tips`,
        `${PostLikeEntity.table}.id as is_liked`,
      ])
      .where(`${PostEntity.table}.user_id`, creatorId)

      .andWhere(function () {
        return this.where(
          `${PostEntity.table}.content_processed`,
          true,
        ).orWhere(`${PostEntity.table}.user_id`, userId)
      })
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(function () {
        return this.whereNull(`${PostEntity.table}.expires_at`).orWhere(
          `${PostEntity.table}.expires_at`,
          '>',
          new Date(),
        )
      })
      .limit(MAX_POST_PER_FEED_REQUEST)
    if (postCategoryId) {
      query = query
        .leftJoin(
          PostToCategoryEntity.table,
          `${PostToCategoryEntity.table}.post_id`,
          `${PostEntity.table}.id`,
        )
        .where(`${PostToCategoryEntity.table}.post_category_id`, postCategoryId)
    }
    if (pinned) {
      query = query.whereNotNull(`${PostEntity.table}.pinned_at`)
    }

    query = createPaginatedQuery(
      query,
      PostEntity.table,
      PostEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    )
    return await this.postService.getPostsFromQuery(userId, query)
  }
}
