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
import { EmailService } from '../email/email.service'
import { CREATOR_NOT_EXIST } from '../follow/constants/errors'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { UserEntity } from '../user/entities/user.entity'
import { CreateFanWallCommentRequestDto } from './dto/create-fan-wall-comment.dto'
import { FanWallCommentDto } from './dto/fan-wall-comment.dto'
import { GetFanWallRequestDto } from './dto/get-fan-wall-comments.dto'
import { FanWallCommentEntity } from './entities/fan-wall-comment.entity'

export const MAX_FAN_WALL_COMMENTS_PER_REQUEST = 10

@Injectable()
export class FanWallService {
  constructor(
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
    private readonly emailService: EmailService,
  ) {}

  async createFanWallComment(
    userId: string,
    createFanWallCommentDto: CreateFanWallCommentRequestDto,
  ): Promise<string> {
    const { creatorId, text, tags } = createFanWallCommentDto
    verifyTaggedText(text, tags)
    await this.checkBlock(userId, creatorId)
    const data = {
      id: v4(),
      creator_id: creatorId,
      commenter_id: userId,
      text,
      tags: JSON.stringify(tags),
    }

    // post creation check incase user was blocked in between the checkPost and writing
    try {
      await this.checkBlock(userId, creatorId)
    } catch (err) {
      await this.dbWriter<FanWallCommentEntity>(FanWallCommentEntity.table)
        .where({ id: data.id })
        .update({ blocked: true })
    }
    await this.dbWriter<FanWallCommentEntity>(
      FanWallCommentEntity.table,
    ).insert(data)
    await this.emailService.sendTaggedUserEmails(
      createFanWallCommentDto.tags,
      'fanwall post',
    )

    return data.id
  }

  async getFanWallForCreator(
    getFanWallRequestDto: GetFanWallRequestDto,
    userId?: string,
  ): Promise<FanWallCommentDto[]> {
    const { creatorId, lastId, createdAt } = getFanWallRequestDto
    if (userId) {
      await this.checkBlock(userId, creatorId)
    }
    let query = this.dbReader<FanWallCommentEntity>(FanWallCommentEntity.table)
      .leftJoin(
        UserEntity.table,
        `${FanWallCommentEntity.table}.commenter_id`,
        `${UserEntity.table}.id`,
      )
      .where({
        creator_id: creatorId,
        blocked: false,
        deactivated: false,
        deleted_at: null,
      })
      .select(
        `${FanWallCommentEntity.table}.*`,
        `${UserEntity.table}.username as commenter_username`,
        `${UserEntity.table}.display_name as commenter_display_name`,
        `${UserEntity.table}.is_creator as commenter_is_creator`,
      )

    if (userId !== getFanWallRequestDto.creatorId) {
      query = query.andWhere('hidden', false)
    }

    query = createPaginatedQuery(
      query,
      FanWallCommentEntity.table,
      FanWallCommentEntity.table,
      'created_at',
      OrderEnum.DESC,
      createdAt,
      lastId,
    )

    const comments = await query.limit(MAX_FAN_WALL_COMMENTS_PER_REQUEST)

    return comments.map(
      (comment) =>
        new FanWallCommentDto(comment, comment.commenter_id === userId),
    )
  }

  async hideFanWallCommment(
    userId: string,
    fanWallCommentId: string,
  ): Promise<boolean> {
    const updated = await this.dbWriter<FanWallCommentEntity>(
      FanWallCommentEntity.table,
    )
      .update({
        hidden: true,
      })
      .where({
        id: fanWallCommentId,
        creator_id: userId,
        hidden: false,
        deleted_at: null,
      })
    return updated === 1
  }

  async unhideFanWallCommment(
    userId: string,
    fanWallCommentId: string,
  ): Promise<boolean> {
    const updated = await this.dbWriter<FanWallCommentEntity>(
      FanWallCommentEntity.table,
    )
      .update({
        hidden: false,
      })
      .where({
        id: fanWallCommentId,
        creator_id: userId,
        hidden: true,
        deleted_at: null,
      })
    return updated === 1
  }

  async deleteFanWallComment(
    userId: string,
    fanWallCommentId: string,
  ): Promise<boolean> {
    const updated = await this.dbWriter<FanWallCommentEntity>(
      FanWallCommentEntity.table,
    )
      .update({
        deleted_at: new Date(),
      })
      .where({
        id: fanWallCommentId,
        deleted_at: null,
      })
      .andWhere(function () {
        return this.where('commenter_id', userId).orWhere('creator_id', userId)
      })
    return updated === 1
  }

  async checkBlock(userId: string, creatorId: string) {
    const followBlockResult = await this.dbReader<FollowBlockEntity>(
      FollowBlockEntity.table,
    )
      .where(`${FollowBlockEntity.table}.follower_id`, userId)
      .where(`${FollowBlockEntity.table}.creator_id`, creatorId)
      .first()

    if (followBlockResult) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }
  }
}
