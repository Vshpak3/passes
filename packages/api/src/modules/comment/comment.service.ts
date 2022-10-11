import { BadRequestException, Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { OrderEnum } from '../../util/dto/page.dto'
import { createPaginatedQuery } from '../../util/page.util'
import { verifyTaggedText } from '../../util/text.util'
import { CreatorSettingsEntity } from '../creator-settings/entities/creator-settings.entity'
import { CommentsBlockedError } from '../creator-settings/error/creator-settings.error'
import { COMMENTS_DISABLED, FOLLOWER_BLOCKED } from '../follow/constants/errors'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { POST_DELETED, POST_NOT_EXIST } from '../post/constants/errors'
import { PostEntity } from '../post/entities/post.entity'
import { UserEntity } from '../user/entities/user.entity'
import { CommentDto } from './dto/comment.dto'
import { CreateCommentRequestDto } from './dto/create-comment.dto'
import { GetCommentsForPostRequestDto } from './dto/get-comments-for-post-dto'
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
    const data = {
      id: v4(),
      post_id: postId,
      commenter_id: userId,
      text,
      tags: JSON.stringify(tags),
    }

    await this.dbWriter.transaction(async (trx) => {
      await trx<CommentEntity>(CommentEntity.table).insert(data)
      await trx<PostEntity>(PostEntity.table)
        .where({ id: postId })
        .increment('num_comments', 1)
    })

    // post creation check incase user was blocked in between the checkPost and writing
    try {
      await this.checkPost(userId, postId)
    } catch (err) {
      await this.dbWriter<CommentEntity>(CommentEntity.table)
        .where({ id: data.id })
        .update({ blocked: true })
    }
    return true
  }

  async findCommentsForPost(
    userId: string,
    getCommentsForPostRequestDto: GetCommentsForPostRequestDto,
  ): Promise<CommentDto[]> {
    const { postId, lastId, createdAt } = getCommentsForPostRequestDto
    const creatorId = await this.checkPost(userId, postId)

    let query = this.dbReader<CommentEntity>(CommentEntity.table)
      .leftJoin(
        UserEntity.table,
        `${CommentEntity.table}.commenter_id`,
        `${UserEntity.table}.id`,
      )
      .where({
        post_id: postId,
        blocked: false,
        deactivated: false,
        deleted_at: null,
      })
      .select(
        `${CommentEntity.table}.*`,
        `${UserEntity.table}.username as commenter_username`,
        `${UserEntity.table}.display_name as commenter_display_name`,
      )
    if (creatorId !== userId) {
      query = query.andWhere('hidden', false)
    }
    query = createPaginatedQuery(
      query,
      CommentEntity.table,
      CommentEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    )
    const comments = await query.limit(MAX_COMMENTS_PER_REQUEST)
    return comments.map((c) => new CommentDto(c))
  }

  async hideComment(userId: string, postId: string, commentId: string) {
    const post = await this.dbReader<PostEntity>(PostEntity.table)
      .where({ id: postId, user_id: userId })
      .select('id')

    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    let updated = 0
    await this.dbWriter.transaction(async (trx) => {
      updated = await trx<CommentEntity>(CommentEntity.table)
        .update({
          hidden: true,
        })
        .where({
          id: commentId,
          post_id: postId,
          hidden: false,
          blocked: false,
          deactivated: false,
          deleted_at: null,
        })
      await trx<CommentEntity>(CommentEntity.table)
        .update({
          hidden: true,
        })
        .where({
          id: commentId,
          commenter_id: userId,
          post_id: postId,
          deleted_at: null,
        })
      if (updated === 1) {
        await trx<PostEntity>(PostEntity.table)
          .where({ id: postId })
          .decrement('num_comments', 1)
      }
    })
    return updated === 1
  }

  async unhideComment(userId: string, postId: string, commentId: string) {
    const post = await this.dbReader<PostEntity>(PostEntity.table)
      .where({ id: postId, user_id: userId })
      .select('id')

    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    let updated = 0
    await this.dbWriter.transaction(async (trx) => {
      updated = await trx<CommentEntity>(CommentEntity.table)
        .update({
          hidden: false,
        })
        .where({
          id: commentId,
          post_id: postId,
          hidden: false,
          blocked: false,
          deactivated: false,
          deleted_at: null,
        })
      if (updated === 1) {
        await trx<PostEntity>(PostEntity.table)
          .where({ id: postId })
          .increment('num_comments', 1)
      }
      updated += await trx<CommentEntity>(CommentEntity.table)
        .update({
          hidden: false,
        })
        .where({
          id: commentId,
          commenter_id: userId,
          post_id: postId,
          deleted_at: null,
        })
    })
    return updated === 1
  }

  async deleteComment(userId: string, postId: string, commentId: string) {
    let updated = 0
    await this.dbWriter.transaction(async (trx) => {
      updated = await trx<CommentEntity>(CommentEntity.table)
        .update({
          deleted_at: new Date(),
        })
        .where({
          id: commentId,
          commenter_id: userId,
          post_id: postId,
          hidden: false,
          blocked: false,
          deactivated: false,
          deleted_at: null,
        })
      if (updated === 1) {
        await trx<PostEntity>(PostEntity.table)
          .where({ id: postId })
          .decrement('num_comments', 1)
      }
      updated += await trx<CommentEntity>(CommentEntity.table)
        .update({
          deleted_at: this.dbWriter.fn.now(),
        })
        .where({
          id: commentId,
          commenter_id: userId,
          post_id: postId,
          deleted_at: null,
        })
    })
    return updated === 1
  }

  async checkPost(userId: string, postId: string): Promise<string> {
    const post = await this.dbReader<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .select(['deleted_at', 'user_id'])
      .first()
    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at) {
      throw new BadRequestException(POST_DELETED)
    }

    const followBlockResult = await this.dbReader<FollowBlockEntity>(
      FollowBlockEntity.table,
    )
      .where(`${FollowBlockEntity.table}.follower_id`, userId)
      .where(`${FollowBlockEntity.table}.creator_id`, post.user_id)
      .first()

    if (followBlockResult) {
      throw new BadRequestException(FOLLOWER_BLOCKED)
    }

    const creatorSettings = await this.dbReader<CreatorSettingsEntity>(
      CreatorSettingsEntity.table,
    )
      .where({ user_id: post.user_id })
      .select('allow_comments_on_posts')
      .first()
    if (!creatorSettings || !creatorSettings.allow_comments_on_posts) {
      throw new CommentsBlockedError(COMMENTS_DISABLED)
    }
    return post.user_id
  }
}
