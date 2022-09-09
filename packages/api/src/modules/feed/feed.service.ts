import { BadRequestException, Injectable } from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CREATOR_NOT_EXIST } from '../follow/constants/errors'
import { FollowEntity } from '../follow/entities/follow.entity'
import { LikeEntity } from '../likes/entities/like.entity'
import { PostEntity } from '../post/entities/post.entity'
import { PostUserAccessEntity } from '../post/entities/post-user-access.entity'
import { PostService } from '../post/post.service'
import { UserEntity } from '../user/entities/user.entity'
import { GetFeedResponseDto } from './dto/get-feed-dto'

export const FEED_LIMIT = 100

@Injectable()
export class FeedService {
  constructor(
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],

    private readonly postService: PostService,
  ) {}

  async getFeed(userId: string, cursor?: string): Promise<GetFeedResponseDto> {
    const dbReader = this.dbReader
    let query = this.dbReader(FollowEntity.table)
      .innerJoin(
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
        `${PostUserAccessEntity.table}.post_id as access`,
        `${LikeEntity.table}.id as is_liked`,
      ])
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(`${PostEntity.table}.is_message`, false)
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
      .orderBy(`${PostEntity.table}.created_at`, 'desc')
      .limit(FEED_LIMIT)

    if (cursor) {
      query = query.andWhere(`${PostEntity.table}.created_at`, '<', cursor)
    }
    const postDtos = await this.postService.getPostsFromQuery(userId, query)
    return new GetFeedResponseDto(
      postDtos,
      postDtos.length > 0
        ? postDtos[postDtos.length - 1].createdAt.toISOString()
        : '',
    )
  }

  async getFeedForCreator(
    creatorId: string,
    userId: string,
    cursor?: string,
  ): Promise<GetFeedResponseDto> {
    const creator = await this.dbReader(UserEntity.table)
      .where('id', creatorId)
      .select(['is_active', 'is_creator'])
      .first()
    if (!creator || !creator.is_active || !creator.is_creator) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }
    const dbReader = this.dbReader
    let query = this.dbReader(UserEntity.table)
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
        `${PostUserAccessEntity.table}.post_id as access`,
        `${LikeEntity.table}.id as is_liked`,
      ])
      .where(`${PostEntity.table}.user_id`, creatorId)
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(`${PostEntity.table}.is_message`, false)
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
      .orderBy(`${PostEntity.table}.created_at`, 'desc')
      .limit(FEED_LIMIT)

    if (cursor) {
      query = query.andWhere(`${PostEntity.table}.created_at`, '<', cursor)
    }
    const postDtos = await this.postService.getPostsFromQuery(userId, query)
    return new GetFeedResponseDto(
      postDtos,
      postDtos.length > 0
        ? postDtos[postDtos.length - 1].createdAt.toISOString()
        : '',
    )
  }

  async getPostsForOwner(
    userId: string,
    isMessage: boolean,
    scheduledOnly: boolean,
    cursor?: string,
  ): Promise<GetFeedResponseDto> {
    let query = this.dbReader(PostEntity.table)
      .select([`${PostEntity.table}.*`])
      .whereNull(`${PostEntity.table}.deleted_at`)
      .andWhere(`${PostEntity.table}.user_id`, userId)
      .andWhere(`${PostEntity.table}.is_message`, isMessage)
      .orderBy(`${PostEntity.table}.created_at`, 'desc')

    if (cursor) {
      query = query.andWhere(`${PostEntity.table}.created_at`, '<', cursor)
    }
    if (scheduledOnly) {
      query = query.whereNotNull('scheduled_at')
    }
    const postDtos = await this.postService.getPostsFromQuery(userId, query)
    // filter out expired posts
    return new GetFeedResponseDto(
      postDtos,
      postDtos.length > 0
        ? postDtos[postDtos.length - 1].createdAt.toISOString()
        : '',
    )
  }
}
