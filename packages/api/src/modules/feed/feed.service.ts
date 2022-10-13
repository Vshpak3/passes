import { BadRequestException, Injectable } from '@nestjs/common'

import { Database, DB_READER } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { OrderEnum } from '../../util/dto/page.dto'
import { createPaginatedQuery } from '../../util/page.util'
import { CREATOR_NOT_EXIST } from '../follow/constants/errors'
import { FollowEntity } from '../follow/entities/follow.entity'
import { LikeEntity } from '../likes/entities/like.entity'
import { PostDto } from '../post/dto/post.dto'
import { PostEntity } from '../post/entities/post.entity'
import { PostUserAccessEntity } from '../post/entities/post-user-access.entity'
import { PostService } from '../post/post.service'
import { UserEntity } from '../user/entities/user.entity'
import { GetFeedRequestDto } from './dto/get-feed-dto'
import { GetProfileFeedRequestDto } from './dto/get-profile-feed.dto'

export const FEED_LIMIT = 5

@Injectable()
export class FeedService {
  constructor(
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],

    private readonly postService: PostService,
  ) {}

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
      .leftJoin(LikeEntity.table, function () {
        this.on(`${PostEntity.table}.id`, `${LikeEntity.table}.post_id`).andOn(
          `${LikeEntity.table}.liker_id`,
          dbReader.raw('?', [userId]),
        )
      })
      .select([
        `${PostEntity.table}.*`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${PostUserAccessEntity.table}.id as access`,
        `${LikeEntity.table}.id as is_liked`,
      ])
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(function () {
        return this.whereNull(`${PostEntity.table}.expires_at`).orWhere(
          `${PostEntity.table}.expires_at`,
          '>',
          new Date(),
        )
      })
      .andWhere(function () {
        return this.whereNull(`${PostEntity.table}.scheduled_at`).orWhere(
          `${PostEntity.table}.scheduled_at`,
          '<=',
          new Date(),
        )
      })
      .andWhere(`${FollowEntity.table}.follower_id`, userId)
      .limit(FEED_LIMIT)
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
    userId: string,
    getProfileFeedRequestDto: GetProfileFeedRequestDto,
  ): Promise<PostDto[]> {
    const { creatorId, lastId, createdAt, pinned } = getProfileFeedRequestDto
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
      .leftJoin(LikeEntity.table, function () {
        this.on(`${LikeEntity.table}.post_id`, `${PostEntity.table}.id`).andOn(
          `${LikeEntity.table}.liker_id`,
          dbReader.raw('?', [userId]),
        )
      })
      .select([
        `${PostEntity.table}.*`,
        `${UserEntity.table}.username`,
        `${UserEntity.table}.display_name`,
        `${PostUserAccessEntity.table}.id as access`,
        `${LikeEntity.table}.id as is_liked`,
      ])
      .where(`${PostEntity.table}.user_id`, creatorId)
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(function () {
        return this.whereNull(`${PostEntity.table}.expires_at`).orWhere(
          `${PostEntity.table}.expires_at`,
          '>',
          new Date(),
        )
      })
      .andWhere(function () {
        return this.whereNull(`${PostEntity.table}.scheduled_at`).orWhere(
          `${PostEntity.table}.scheduled_at`,
          '<=',
          new Date(),
        )
      })
      .limit(FEED_LIMIT)

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
