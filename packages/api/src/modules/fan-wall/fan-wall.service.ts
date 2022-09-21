import { BadRequestException, Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { verifyTaggedText } from '../../util/text.util'
import { CREATOR_NOT_EXIST } from '../follow/constants/errors'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { UserEntity } from '../user/entities/user.entity'
import { CreateFanWallCommentRequestDto } from './dto/create-fan-wall-comment.dto'
import { FanWallCommentDto } from './dto/fan-wall-comment.dto'
import {
  GetFanWallRequestDto,
  GetFanWallResponseDto,
} from './dto/get-fan-wall-comments.dto'
import { FanWallCommentEntity } from './entities/fan-wall-comment.entity'

export const MAX_FAN_WALL_COMMENTS_PER_REQUEST = 20
@Injectable()
export class FanWallService {
  constructor(
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async createFanWallComment(
    userId: string,
    createFanWallCommentDto: CreateFanWallCommentRequestDto,
  ): Promise<boolean> {
    const { creatorId, text, tags } = createFanWallCommentDto
    verifyTaggedText(text, tags)
    await this.checkBlock(userId, creatorId)
    const data = FanWallCommentEntity.toDict<FanWallCommentEntity>({
      id: v4(),
      creator: creatorId,
      commenter: userId,
      text,
      tags: JSON.stringify(tags),
    })

    // post creation check incase user was blocked in between the checkPost and writing
    try {
      await this.checkBlock(userId, creatorId)
    } catch (err) {
      await this.dbWriter(FanWallCommentEntity.table)
        .where('id', data.id)
        .update('blocked', true)
    }
    await this.dbWriter(FanWallCommentEntity.table).insert(data)

    return true
  }

  async getFanWallForCreator(
    userId: string,
    getFanWallRequestDto: GetFanWallRequestDto,
  ): Promise<GetFanWallResponseDto> {
    const { creatorId, lastId, createdAt } = getFanWallRequestDto
    await this.checkBlock(userId, creatorId)
    let query = this.dbReader(FanWallCommentEntity.table)
      .leftJoin(
        UserEntity.table,
        `${FanWallCommentEntity.table}.commenter_id`,
        `${UserEntity.table}.id`,
      )
      .where(
        FanWallCommentEntity.toDict<FanWallCommentEntity>({
          creator: creatorId,
          hidden: false,
          blocked: false,
          deactivated: false,
          deletedAt: null,
        }),
      )
      .select(
        `${FanWallCommentEntity.table}.*`,
        `${UserEntity.table}.username as commenter_username`,
        `${UserEntity.table}.display_name as commenter_display_name`,
      )
      .orderBy([
        { column: `${FanWallCommentEntity.table}.created_at`, order: 'desc' },
        { column: `${FanWallCommentEntity.table}.id`, order: 'desc' },
      ])

    if (lastId) {
      query = query.andWhere(`${FanWallCommentEntity.table}.id`, '<', lastId)
    }
    if (createdAt) {
      query = query.andWhere(
        `${FanWallCommentEntity.table}.created_at`,
        '<=',
        createdAt,
      )
    }

    const comments = await query.limit(MAX_FAN_WALL_COMMENTS_PER_REQUEST)

    return new GetFanWallResponseDto(
      comments.map((comment) => new FanWallCommentDto(comment)),
    )
  }

  async hideFanWallCommment(
    userId: string,
    fanWallCommentId: string,
  ): Promise<boolean> {
    const data = FanWallCommentEntity.toDict<FanWallCommentEntity>({
      hidden: true,
    })
    const updated = await this.dbWriter(FanWallCommentEntity.table)
      .update(data)
      .where(
        FanWallCommentEntity.toDict<FanWallCommentEntity>({
          id: fanWallCommentId,
          creator: userId,
          hidden: false,
          deletedAt: null,
        }),
      )
    return updated === 1
  }

  async unhideFanWallCommment(
    userId: string,
    fanWallCommentId: string,
  ): Promise<boolean> {
    const data = FanWallCommentEntity.toDict<FanWallCommentEntity>({
      hidden: false,
    })
    const updated = await this.dbWriter(FanWallCommentEntity.table)
      .update(data)
      .where(
        FanWallCommentEntity.toDict<FanWallCommentEntity>({
          id: fanWallCommentId,
          creator: userId,
          hidden: true,
          deletedAt: null,
        }),
      )
    return updated === 1
  }

  async deleteFanWallComment(
    userId: string,
    fanWallCommentId: string,
  ): Promise<boolean> {
    const data = FanWallCommentEntity.toDict<FanWallCommentEntity>({
      deletedAt: this.dbWriter.fn.now(),
    })
    const updated = await this.dbWriter(FanWallCommentEntity.table)
      .update(data)
      .where(
        FanWallCommentEntity.toDict<FanWallCommentEntity>({
          id: fanWallCommentId,
          commenter: userId,
          deletedAt: null,
        }),
      )
    return updated === 1
  }

  async checkBlock(userId: string, creatorId: string) {
    const followBlockResult = await this.dbReader(FollowBlockEntity.table)
      .where(`${FollowBlockEntity.table}.follower_id`, userId)
      .where(`${FollowBlockEntity.table}.creator_id`, creatorId)
      .first()

    if (followBlockResult) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }
  }
}
