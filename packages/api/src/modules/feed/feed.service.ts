import { Injectable } from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
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
          `${FollowEntity.table}.creator_id`,
          `${PostUserAccessEntity.table}.user_id`,
        ).andOn(
          `${PostEntity.table}.id`,
          `${PostUserAccessEntity.table}.post_id`,
        )
      })
      .leftJoin(
        LikeEntity.table,
        `${LikeEntity.table}.post_id`,
        `${PostEntity.table}.id`,
      )
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
      .andWhere(`${PostEntity.table}.scheduled_at`, '<=', new Date())
      .andWhere(`${LikeEntity.table}.liker_id`, userId)
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

  async getFeedByCreator(
    creatorId: string,
    userId: string,
    cursor?: string,
  ): Promise<GetFeedResponseDto> {
    let query = this.dbReader(UserEntity.table)
      .innerJoin(
        PostEntity.table,
        `${UserEntity.table}.id`,
        `${PostEntity.table}.user_id`,
      )
      .leftJoin(PostUserAccessEntity.table, function () {
        this.on(
          `${UserEntity.table}.id`,
          `${PostUserAccessEntity.table}.user_id`,
        ).andOn(
          `${PostEntity.table}.id`,
          `${PostUserAccessEntity.table}.post_id`,
        )
      })
      .leftJoin(
        LikeEntity.table,
        `${LikeEntity.table}.post_id`,
        `${PostEntity.table}.id`,
      )
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
      .andWhere(`${PostEntity.table}.scheduled_at`, '<=', new Date())
      .andWhere(`${LikeEntity.table}.liker_id`, userId)
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

  async getPostsForCreator(
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
