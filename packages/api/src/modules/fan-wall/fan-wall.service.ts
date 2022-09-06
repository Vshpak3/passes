import { BadRequestException, Injectable } from '@nestjs/common'

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

    const followBlockResult = await this.dbReader(FollowBlockEntity.table)
      .where(`${FollowBlockEntity.table}.follower_id`, userId)
      .where(`${FollowBlockEntity.table}.creator_id`, creatorId)
      .first()

    if (followBlockResult) {
      throw new BadRequestException(CREATOR_NOT_EXIST)
    }

    const data = FanWallCommentEntity.toDict<FanWallCommentEntity>({
      creator: creatorId,
      commenter: userId,
      text: content,
    })

    await this.dbWriter(FanWallCommentEntity.table).insert(data)

    return true
  }

  async getFanWallForCreator(
    creatorId: string,
  ): Promise<GetFanWallForCreatorResponseDto> {
    const comments = await this.dbReader(FanWallCommentEntity.table)
      .leftJoin(
        UserEntity.table,
        `${FanWallCommentEntity.table}.commenter_id`,
        `${UserEntity.table}.id`,
      )
      .where(
        FanWallCommentEntity.toDict<FanWallCommentEntity>({
          creator: creatorId,
          hiddenAt: null,
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
      hiddenAt: this.dbWriter.fn.now(),
    })
    const updated = await this.dbWriter(FanWallCommentEntity.table)
      .update(data)
      .where(
        FanWallCommentEntity.toDict<FanWallCommentEntity>({
          id: fanWallCommentId,
          creator: userId,
          hiddenAt: null,
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
          hiddenAt: null,
          deletedAt: null,
        }),
      )
    return updated === 1
  }
}
