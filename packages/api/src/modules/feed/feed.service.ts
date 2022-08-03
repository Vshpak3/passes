import { EntityRepository } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { GetContentDto } from '../content/dto/get-content.dto'
import { GetPostDto } from '../post/dto/get-post.dto'
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
    private readonly entityManager: EntityManager,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async getFeed(userId: string, cursor: string): Promise<GetFeedDto> {
    const knex = this.entityManager.getKnex()

    const following = await knex
      .select('creator_id')
      .from('subscription')
      .where('subscriber_id', userId)
      .where('is_active', true)

    if (following.length === 0) {
      return new GetFeedDto([], '')
    }

    const creatorIds: string[] = following.map((f) => f.creator_id)

    let postsQuery = knex('post')
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
  ): Promise<GetFeedDto> {
    const user = await this.userRepository.findOne({ userName: username })
    if (!user) {
      throw new NotFoundException(USER_NOT_EXIST)
    }

    if (!user.isCreator) {
      throw new BadRequestException(USER_IS_NOT_CREATOR)
    }

    const knex = this.entityManager.getKnex()
    let postsQuery = knex('post')
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
    const knex = this.entityManager.getKnex()
    const contentResults = await knex('content').whereIn('post_id', postIds)

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
