import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { FollowRestrictEntity } from '../follow/entities/follow-restrict.entity'
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

  async create(
    userId: string,
    createCommentDto: CreateCommentRequestDto,
  ): Promise<GetCommentResponseDto> {
    const { postId, content } = createCommentDto
    const post = await this.dbReader(PostEntity.table)
      .where({ id: postId })
      .first()
    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at !== null) {
      throw new BadRequestException(POST_DELETED)
    }

    const followRestrictResult = await this.dbReader(FollowRestrictEntity.table)
      .where(`${FollowRestrictEntity.table}.follower_id`, userId)
      .where(`${FollowRestrictEntity.table}.creator_id`, post.user_id)
      .first()

    if (followRestrictResult) {
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

  async findOne(id: string): Promise<GetCommentResponseDto> {
    const comment = await this.dbReader(CommentEntity.table)
      .leftJoin(UserEntity.table, 'comment.commenter_id', 'users.id')
      .where({ 'comment.id': id })
      .select('comment.*', 'users.username as commenter_username')
      .first()

    if (!comment) {
      throw new BadRequestException(COMMENT_NOT_EXIST)
    }

    if (comment.is_hidden || comment.deleted_at !== null) {
      throw new BadRequestException(COMMENT_REMOVED)
    }

    return new GetCommentResponseDto(comment)
  }

  async findAllForPost(postId: string): Promise<GetCommentsForPostResponseDto> {
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
      .leftJoin(UserEntity.table, 'comment.commenter_id', 'users.id')
      .where({
        post_id: postId,
        is_hidden: false,
        deleted_at: null,
      })
      .select('comment.*', 'users.username as commenter_username')

    return new GetCommentsForPostResponseDto(postId, comments)
  }

  async hide(userId: string, id: string) {
    const comment = await this.dbReader(CommentEntity.table)
      .where({ id })
      .select(['id', 'is_hidden', 'deleted_at'])
      .first()

    if (!comment) {
      throw new BadRequestException(COMMENT_NOT_EXIST)
    }

    if (comment.is_hidden || comment.deleted_at !== null) {
      throw new BadRequestException(COMMENT_REMOVED)
    }

    const post = await this.dbReader(PostEntity.table)
      .where({ id: comment.post_id })
      .first()
    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at !== null) {
      throw new BadRequestException(POST_DELETED)
    }

    if (post.user_id !== userId) {
      throw new ForbiddenException(POST_NOT_OWNED_BY_USER)
    }

    const data = CommentEntity.toDict<CommentEntity>({
      isHidden: true,
    })

    await this.dbWriter.transaction(async (trx) => {
      if (!comment.is_hidden && !comment.deleted_at) {
        await trx(PostEntity.table)
          .where('id', post.id)
          .decrement('num_comments', 1)
      }
      await trx(CommentEntity.table).update(data).where({ id })
    })
  }

  async delete(userId: string, id: string) {
    const comment = await this.dbReader(CommentEntity.table)
      .where({ id })
      .select(['id', 'is_hidden', 'deleted_at'])
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

    const post = await this.dbReader(PostEntity.table)
      .where({ id: comment.post_id })
      .first()
    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at !== null) {
      throw new BadRequestException(POST_DELETED)
    }

    const data = CommentEntity.toDict<CommentEntity>({
      deletedAt: this.dbWriter.fn.now(),
    })

    await this.dbWriter.transaction(async (trx) => {
      if (!comment.is_hidden && !comment.deleted_at) {
        await trx(PostEntity.table)
          .where('id', post.id)
          .decrement('num_comments', 1)
      }
      await trx(CommentEntity.table).update(data).where({ id })
    })
  }
}
