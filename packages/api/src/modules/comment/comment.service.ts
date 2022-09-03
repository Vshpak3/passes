import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import {
  POST_DELETED,
  POST_NOT_EXIST,
  POST_NOT_OWNED_BY_USER,
} from '../post/constants/errors'
import { PostEntity } from '../post/entities/post.entity'
import { UserEntity } from '../user/entities/user.entity'
import {
  COMMENT_NOT_EXIST,
  COMMENT_NOT_OWNED_BY_USER,
  COMMENT_REMOVED,
} from './constants/errors'
import { CreateCommentRequestDto } from './dto/create-comment.dto'
import { GetCommentResponseDto } from './dto/get-comment.dto'
import { GetCommentsForPostResponseDto } from './dto/get-comments-for-post-dto'
import { CommentEntity } from './entities/comment.entity'

@Injectable()
export class CommentService {
  constructor(
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async createComment(
    userId: string,
    createCommentDto: CreateCommentRequestDto,
  ): Promise<GetCommentResponseDto> {
    const { postId, content } = createCommentDto
    const post = await this.dbReader(PostEntity.table)
      .where({ id: postId })
      .select(['deleted_at', 'user_id'])
      .first()
    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at !== null) {
      throw new BadRequestException(POST_DELETED)
    }

    const followBlockResult = await this.dbReader(FollowBlockEntity.table)
      .where(`${FollowBlockEntity.table}.follower_id`, userId)
      .where(`${FollowBlockEntity.table}.creator_id`, post.user_id)
      .first()

    if (followBlockResult) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    const data = CommentEntity.toDict<CommentEntity>({
      post: postId,
      commenter: userId,
      content: content,
    })

    await this.dbWriter.transaction(async (trx) => {
      await trx(CommentEntity.table).insert(data)
      await trx(PostEntity.table)
        .where('id', postId)
        .increment('num_comments', 1)
    })

    return new GetCommentResponseDto(data)
  }

  async findComment(commentId: string): Promise<GetCommentResponseDto> {
    const comment = await this.dbReader(CommentEntity.table)
      .leftJoin(
        UserEntity.table,
        `${CommentEntity.table}.commenter_id`,
        `${UserEntity.table}.id`,
      )
      .where(`${CommentEntity.table}.id`, commentId)
      .select(
        `${CommentEntity.table}.*`,
        `${UserEntity.table}.username as commenter_username`,
      )
      .first()

    if (!comment) {
      throw new BadRequestException(COMMENT_NOT_EXIST)
    }

    if (comment.is_hidden || comment.deleted_at !== null) {
      throw new BadRequestException(COMMENT_REMOVED)
    }

    return new GetCommentResponseDto(comment)
  }

  async findCommentsForPost(
    postId: string,
  ): Promise<GetCommentsForPostResponseDto> {
    const post = await this.dbReader(PostEntity.table)
      .where({ id: postId })
      .first()

    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at !== null) {
      throw new BadRequestException(POST_DELETED)
    }

    const comments = await this.dbReader(CommentEntity.table)
      .leftJoin(
        UserEntity.table,
        `${CommentEntity.table}.commenter_id`,
        `${UserEntity.table}.id`,
      )
      .where({
        post_id: postId,
        is_hidden: false,
        deleted_at: null,
      })
      .select(
        `${CommentEntity.table}.*`,
        `${UserEntity.table}.username as commenter_username`,
      )

    return new GetCommentsForPostResponseDto(postId, comments)
  }

  async hideComment(userId: string, commentId: string) {
    const comment = await this.dbReader(CommentEntity.table)
      .innerJoin(
        PostEntity.table,
        `${PostEntity.table}.id`,
        `${CommentEntity.table}.post_id`,
      )
      .where(CommentEntity.toDict<CommentEntity>({ id: commentId }))
      .select([
        `${CommentEntity.table}.id`,
        `${CommentEntity.table}.is_hidden`,
        `${CommentEntity.table}.deleted_at`,
        `${CommentEntity.table}.post_id`,
        `${PostEntity.table}.user_id as creator_id`,
      ])
      .first()

    if (!comment) {
      throw new BadRequestException(COMMENT_NOT_EXIST)
    }

    if (comment.is_hidden || comment.deleted_at !== null) {
      throw new BadRequestException(COMMENT_REMOVED)
    }

    if (comment.creator_id !== userId) {
      throw new BadRequestException(POST_NOT_OWNED_BY_USER)
    }

    const data = CommentEntity.toDict<CommentEntity>({
      isHidden: true,
    })

    await this.dbWriter.transaction(async (trx) => {
      const updated = await trx(CommentEntity.table)
        .update(data)
        .where(
          CommentEntity.toDict<CommentEntity>({
            id: commentId,
            isHidden: false,
            deletedAt: null,
          }),
        )
      if (updated === 1) {
        await trx(PostEntity.table)
          .where('id', comment.post_id)
          .decrement('num_comments', 1)
      }
    })
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.dbReader(CommentEntity.table)
      .where({ id: commentId })
      .select(['id', 'is_hidden', 'deleted_at', 'commenter_id'])
      .first()

    if (!comment) {
      throw new BadRequestException(COMMENT_NOT_EXIST)
    }

    if (comment.commenter_id !== userId) {
      throw new ForbiddenException(COMMENT_NOT_OWNED_BY_USER)
    }

    if (comment.deleted_at !== null) {
      throw new ConflictException(COMMENT_REMOVED)
    }

    const data = CommentEntity.toDict<CommentEntity>({
      deletedAt: this.dbWriter.fn.now(),
    })

    await this.dbWriter.transaction(async (trx) => {
      const updated = await trx(CommentEntity.table)
        .update(data)
        .where(
          CommentEntity.toDict<CommentEntity>({
            id: commentId,
            isHidden: false,
            deletedAt: null,
          }),
        )
      if (updated === 1) {
        await trx(PostEntity.table)
          .where('id', comment.post_id)
          .decrement('num_comments', 1)
      }
    })
  }
}
