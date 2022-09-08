import { BadRequestException, Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CREATOR_NOT_EXIST } from '../follow/constants/errors'
import { FollowBlockEntity } from '../follow/entities/follow-block.entity'
import { UserEntity } from '../user/entities/user.entity'
import { CreateFanWallCommentRequestDto } from './dto/create-fan-wall-comment.dto'
import { GetFanWallForCreatorResponseDto } from './dto/get-fan-wall-comments-for-post-dto'
import { FanWallCommentEntity } from './entities/fan-wall-comment.entity'

@Injectable()
export class FanWallService {
  constructor(
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async createFanWallComment(
    userId: string,
    createFanWallCommentDto: CreateFanWallCommentRequestDto,
  ): Promise<boolean> {
    const { creatorId, text: content } = createFanWallCommentDto

    await this.checkBlock(userId, creatorId)
    const data = FanWallCommentEntity.toDict<FanWallCommentEntity>({
      id: v4(),
      creator: creatorId,
      commenter: userId,
      text: content,
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
    creatorId: string,
  ): Promise<GetFanWallForCreatorResponseDto> {
    await this.checkBlock(userId, creatorId)
    const comments = await this.dbReader(FanWallCommentEntity.table)
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
      .orderBy('created_at', 'desc')

    return new GetFanWallForCreatorResponseDto(comments)
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
