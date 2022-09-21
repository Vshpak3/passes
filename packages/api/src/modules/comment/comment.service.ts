import { BadRequestException, Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { verifyTaggedText } from '../../util/text.util'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { CommentsBlockedError } from '../creator-settings/error/creator-settings.error'
import { COMMNETS_DISABLED, FOLLOWER_BLOCKED } from '../follow/constants/errors'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { POST_DELETED, POST_NOT_EXIST } from '../post/constants/errors'
import { PostEntity } from '../post/entities/post.entity'
import { UserEntity } from '../user/entities/user.entity'
import { CommentDto } from './dto/comment.dto'
import { CreateCommentRequestDto } from './dto/create-comment.dto'
import {
  GetCommentsForPostRequestDto,
  GetCommentsForPostResponseDto,
} from './dto/get-comments-for-post-dto'
import { CommentEntity } from './entities/comment.entity'

export const MAX_COMMENTS_PER_REQUEST = 20

@Injectable()
export class CommentService {
  constructor(
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async createComment(
    userId: string,
    createCommentDto: CreateCommentRequestDto,
  ): Promise<boolean> {
    const { postId, text, tags } = createCommentDto
    verifyTaggedText(text, tags)
    await this.checkPost(userId, postId)
    const data = CommentEntity.toDict<CommentEntity>({
      id: v4(),
      post: postId,
      commenter: userId,
      text,
      tags: JSON.stringify(tags),
    })

    await this.dbWriter.transaction(async (trx) => {
      await trx(CommentEntity.table).insert(data)
      await trx(PostEntity.table)
        .where('id', postId)
        .increment('num_comments', 1)
    })

    // post creation check incase user was blocked in between the checkPost and writing
    try {
      await this.checkPost(userId, postId)
    } catch (err) {
      await this.dbWriter(CommentEntity.table)
        .where('id', data.id)
        .update('blocked', true)
    }
    return true
  }

  async findCommentsForPost(
    userId: string,
    getCommentsForPostRequestDto: GetCommentsForPostRequestDto,
  ): Promise<GetCommentsForPostResponseDto> {
    const { postId, lastId, createdAt } = getCommentsForPostRequestDto
    await this.checkPost(userId, postId)

    let query = this.dbReader(CommentEntity.table)
      .leftJoin(
        UserEntity.table,
        `${CommentEntity.table}.commenter_id`,
        `${UserEntity.table}.id`,
      )
      .where(
        CommentEntity.toDict<CommentEntity>({
          id: postId,
          hidden: false,
          blocked: false,
          deactivated: false,
          deletedAt: null,
        }),
      )
      .select(
        `${CommentEntity.table}.*`,
        `${UserEntity.table}.username as commenter_username`,
        `${UserEntity.table}.display_name as commenter_display_name`,
      )
      .orderBy([
        { column: `${CommentEntity.table}.created_at`, order: 'desc' },
        { column: `${CommentEntity.table}.id`, order: 'desc' },
      ])
    if (lastId) {
      query = query.andWhere(`${CommentEntity.table}.id`, '<', lastId)
    }
    if (createdAt) {
      query = query.andWhere(
        `${CommentEntity.table}.created_at`,
        '<=',
        createdAt,
      )
    }

    const comments = await query.limit(MAX_COMMENTS_PER_REQUEST)

    return new GetCommentsForPostResponseDto(
      comments.map((c) => new CommentDto(c)),
    )
  }

  async hideComment(userId: string, postId: string, commentId: string) {
    const post = await this.dbReader(PostEntity.table)
      .where(PostEntity.toDict<PostEntity>({ id: postId, user: userId }))
      .select('id')

    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    const data = CommentEntity.toDict<CommentEntity>({
      hidden: true,
    })
    let updated = 0
    await this.dbWriter.transaction(async (trx) => {
      updated = await trx(CommentEntity.table)
        .update(data)
        .where(
          CommentEntity.toDict<CommentEntity>({
            id: commentId,
            post: postId,
            hidden: false,
            blocked: false,
            deactivated: false,
            deletedAt: null,
          }),
        )
      await trx(CommentEntity.table)
        .update(data)
        .where(
          CommentEntity.toDict<CommentEntity>({
            id: commentId,
            commenter: userId,
            post: postId,
            deletedAt: null,
          }),
        )
      if (updated === 1) {
        await trx(PostEntity.table)
          .where('id', postId)
          .decrement('num_comments', 1)
      }
    })
    return updated === 1
  }

  async unhideComment(userId: string, postId: string, commentId: string) {
    const post = await this.dbReader(PostEntity.table)
      .where(PostEntity.toDict<PostEntity>({ id: postId, user: userId }))
      .select('id')

    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    const data = CommentEntity.toDict<CommentEntity>({
      hidden: false,
    })
    let updated = 0
    await this.dbWriter.transaction(async (trx) => {
      updated = await trx(CommentEntity.table)
        .update(data)
        .where(
          CommentEntity.toDict<CommentEntity>({
            id: commentId,
            post: postId,
            hidden: false,
            blocked: false,
            deactivated: false,
            deletedAt: null,
          }),
        )
      if (updated === 1) {
        await trx(PostEntity.table)
          .where('id', postId)
          .increment('num_comments', 1)
      }
      updated += await trx(CommentEntity.table)
        .update(data)
        .where(
          CommentEntity.toDict<CommentEntity>({
            id: commentId,
            commenter: userId,
            post: postId,
            deletedAt: null,
          }),
        )
    })
    return updated === 1
  }

  async deleteComment(userId: string, postId: string, commentId: string) {
    const data = CommentEntity.toDict<CommentEntity>({
      deletedAt: this.dbWriter.fn.now(),
    })
    let updated = 0
    await this.dbWriter.transaction(async (trx) => {
      updated = await trx(CommentEntity.table)
        .update(data)
        .where(
          CommentEntity.toDict<CommentEntity>({
            id: commentId,
            commenter: userId,
            post: postId,
            hidden: null,
            blocked: false,
            deactivated: false,
            deletedAt: null,
          }),
        )
      if (updated === 1) {
        await trx(PostEntity.table)
          .where('id', postId)
          .decrement('num_comments', 1)
      }
      updated += await trx(CommentEntity.table)
        .update(data)
        .where(
          CommentEntity.toDict<CommentEntity>({
            id: commentId,
            commenter: userId,
            post: postId,
            deletedAt: null,
          }),
        )
    })
    return updated === 1
  }

  async checkPost(userId: string, postId: string) {
    const post = await this.dbReader(PostEntity.table)
      .where({ id: postId })
      .select(['deleted_at', 'user_id'])
      .first()
    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at) {
      throw new BadRequestException(POST_DELETED)
    }

    const followBlockResult = await this.dbReader(FollowBlockEntity.table)
      .where(`${FollowBlockEntity.table}.follower_id`, userId)
      .where(`${FollowBlockEntity.table}.creator_id`, post.user_id)
      .first()

    if (followBlockResult) {
      throw new BadRequestException(FOLLOWER_BLOCKED)
    }

    const creatorSettings = await this.dbReader(CreatorSettingsEntity.table)
      .where('user_id', post.user_id)
      .select('allow_comments_on_posts')
      .first()
    if (!creatorSettings.allow_comments_on_posts) {
      throw new CommentsBlockedError(COMMNETS_DISABLED)
    }
  }
}
