import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { GetContentDto } from '../content/dto/get-content.dto'
import { ContentEntity } from '../content/entities/content.entity'
import { FollowEntity } from '../follow/entities/follow.entity'
import { GetPostDto } from '../post/dto/get-post.dto'
import { PostEntity } from '../post/entities/post.entity'
import {
  USER_IS_NOT_CREATOR,
  USER_NOT_EXIST,
} from '../profile/constants/errors'
import { UserEntity } from '../user/entities/user.entity'
import { GetFeedDto } from './dto/get-feed-dto'

type ContentLookupByPost = {
  [postId: number]: GetContentDto[]
}

@Injectable()
export class FeedService {
  constructor(
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
  ) {}

  async getFeed(userId: string, cursor: string): Promise<GetFeedDto> {
    const following = await this.dbReader(FollowEntity.table)
      .select('creator_id')
      .where('subscriber_id', userId)
      .where('is_active', true)

    if (following.length === 0) {
      return new GetFeedDto([], '')
    }

    const creatorIds: string[] = following.map((f) => f.creator_id)

    let postsQuery = this.dbReader(PostEntity.table)
      .select(
        '*',
        this.dbReader.raw(
          `exists(select * from post_like l where l.post_id = ${PostEntity.table}.id and l.liker_id = '${userId}') as is_liked`,
        ),
      )
      .whereIn('user_id', creatorIds)
      .where('deleted_at', null)

    if (cursor) {
      postsQuery = postsQuery.where('created_at', '<', cursor)
    }

    postsQuery = postsQuery.orderBy('created_at', 'desc').limit(100)

    const posts = await postsQuery
    const postIds = posts.map((p) => p.id)

    const contentLookup = await this.getContentLookupForPosts(postIds)

    const postDtos: GetPostDto[] = posts.map((p) => ({
      id: p.id,
      userId: p.user_id,
      text: p.text,
      content: contentLookup[p.id] ?? [],
      numComments: p.num_comments,
      numLikes: p.num_likes,
      hasLiked: !!p.is_liked,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }))

    return new GetFeedDto(
      postDtos,
      postDtos.length ? postDtos[postDtos.length - 1].createdAt : '',
    )
  }

  async getPostsByCreatorUsername(
    username: string,
    cursor: string,
    userId?: string,
  ): Promise<GetFeedDto> {
    const user = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ username }))
      .first()
    if (!user) {
      throw new NotFoundException(USER_NOT_EXIST)
    }

    if (!user.is_creator) {
      throw new BadRequestException(USER_IS_NOT_CREATOR)
    }

    let postsQuery = this.dbReader(PostEntity.table)
      .select(
        userId
          ? [
              '*',
              this.dbReader.raw(
                `exists(select * from post_like l where l.post_id = ${PostEntity.table}.id and l.liker_id = '${userId}') as is_liked`,
              ),
            ]
          : '*',
      )
      .where('user_id', user.id)
      .where('deleted_at', null)

    if (cursor) {
      postsQuery = postsQuery.where('created_at', '<', cursor)
    }

    postsQuery = postsQuery.orderBy('created_at', 'desc').limit(100)

    const posts = await postsQuery
    const postIds = posts.map((p) => p.id)

    const contentLookup = await this.getContentLookupForPosts(postIds)

    const postDtos: GetPostDto[] = posts.map((p) => {
      return {
        id: p.id,
        userId: p.user_id,
        text: p.text,
        content: contentLookup[p.id] ?? [],
        numComments: p.num_comments,
        numLikes: p.num_likes,
        hasLiked: !!p.is_liked,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }
    })

    return new GetFeedDto(
      postDtos,
      postDtos.length ? postDtos[postDtos.length - 1].createdAt : '',
    )
  }

  private async getContentLookupForPosts(
    postIds: string[],
  ): Promise<ContentLookupByPost> {
    const contentResults = await this.dbReader(ContentEntity.table).whereIn(
      'post_id',
      postIds,
    )

    const ans: ContentLookupByPost = {}
    for (let i = 0; i < contentResults.length; ++i) {
      const c = contentResults[i]

      if (!(c.post_id in ans)) {
        ans[c.post_id] = []
      }

      ans[c.post_id].push(c)
    }

    return ans
  }
}
