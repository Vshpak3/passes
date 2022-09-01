import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { UserEntity } from '../user/entities/user.entity'
import {
  FAN_WALL_COMMENT_NOT_EXIST,
  FAN_WALL_COMMENT_NOT_FOR_CREATOR,
  FAN_WALL_COMMENT_NOT_OWNED_BY_USER,
  FAN_WALL_COMMENT_REMOVED,
  FAN_WALL_USER_IS_NOT_CREATOR,
} from './constants/errors'
import { CommentDto } from './dto/comment.dto'
import { CreateFanWallCommentRequestDto } from './dto/create-comment.dto'
import { GetFanWallForCreatorResponseDto } from './dto/get-comments-for-post-dto'
import { FanWallCommentEntity } from './entities/fan-wall-comment.entity'

@Injectable()
export class FanWallService {
  constructor(
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async create(
    userId: string,
    createCommentDto: CreateFanWallCommentRequestDto,
  ): Promise<CommentDto> {
    const { creatorUsername, content } = createCommentDto
    const creator = await this.dbReader(UserEntity.table)
      .where({ username: creatorUsername })
      .first()
    if (!creator || !creator.is_creator || creator.is_disabled) {
      throw new BadRequestException(FAN_WALL_USER_IS_NOT_CREATOR)
    }

    const data = FanWallCommentEntity.toDict<FanWallCommentEntity>({
      creator: creator.id,
      commenter: userId,
      content: content,
    })

    await this.dbWriter(FanWallCommentEntity.table).insert(data)

    return new CommentDto(data)
  }

  async findAllForCreator(
    creatorUsername: string,
  ): Promise<GetFanWallForCreatorResponseDto> {
    const creator = await this.dbReader(UserEntity.table)
      .where({ username: creatorUsername })
      .first()
    if (!creator || !creator.is_creator || creator.is_disabled) {
      return new GetFanWallForCreatorResponseDto([])
    }

    const comments = await this.dbReader(FanWallCommentEntity.table)
      .leftJoin(UserEntity.table, 'fan_wall_comment.commenter_id', 'users.id')
      .where({
        creator_id: creator.id,
        is_hidden: false,
        deleted_at: null,
      })
      .select('fan_wall_comment.*', 'users.username as commenter_username')
      .orderBy('created_at', 'desc')

    return new GetFanWallForCreatorResponseDto(comments)
  }

  async hide(userId: string, id: string) {
    const comment = await this.dbReader(FanWallCommentEntity.table)
      .where({ id })
      .first()

    if (!comment) {
      throw new BadRequestException(FAN_WALL_COMMENT_NOT_EXIST)
    }

    if (comment.is_hidden || comment.deleted_at !== null) {
      throw new BadRequestException(FAN_WALL_COMMENT_REMOVED)
    }

    if (comment.creator_id !== userId) {
      throw new ForbiddenException(FAN_WALL_COMMENT_NOT_FOR_CREATOR)
    }

    const data = FanWallCommentEntity.toDict<FanWallCommentEntity>({
      isHidden: true,
    })

    await this.dbWriter(FanWallCommentEntity.table).update(data).where({ id })
  }

  async delete(userId: string, id: string) {
    const comment = await this.dbReader(FanWallCommentEntity.table)
      .where({ id })
      .first()

    if (!comment) {
      throw new BadRequestException(FAN_WALL_COMMENT_NOT_EXIST)
    }

    if (comment.commenter_id !== userId) {
      throw new ForbiddenException(FAN_WALL_COMMENT_NOT_OWNED_BY_USER)
    }

    if (comment.deleted_at !== null) {
      throw new ConflictException(FAN_WALL_COMMENT_REMOVED)
    }

    const data = FanWallCommentEntity.toDict<FanWallCommentEntity>({
      deletedAt: new Date(),
    })

    await this.dbWriter(FanWallCommentEntity.table).update(data).where({ id })
  }
}
