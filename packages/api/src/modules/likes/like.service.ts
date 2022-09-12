import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { POST_DELETED, POST_NOT_EXIST } from '../post/constants/errors'
import { PostEntity } from '../post/entities/post.entity'
import { LikeEntity } from './entities/like.entity'

@Injectable()
export class LikeService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async checkLike(userId: string, postId: string): Promise<boolean> {
    return !!(await this.dbReader(LikeEntity.table)
      .where(
        LikeEntity.toDict<LikeEntity>({
          post: postId,
          liker: userId,
        }),
      )
      .select('id')
      .first())
  }

  async likePost(userId: string, postId: string) {
    const post = await this.dbReader(PostEntity.table)
      .where({ id: postId })
      .first()
    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at) {
      throw new BadRequestException(POST_DELETED)
    }

    await this.dbWriter.transaction(async (trx) => {
      await trx(LikeEntity.table).insert(
        LikeEntity.toDict<LikeEntity>({
          post: postId,
          liker: userId,
        }),
      )
      await trx(PostEntity.table).where('id', postId).increment('num_likes', 1)
      await trx(CreatorStatEntity.table)
        .where('user_id', userId)
        .increment('num_likes', 1)
    })
  }

  async unlikePost(userId: string, postId: string) {
    const post = await this.dbReader(PostEntity.table)
      .where({ id: postId })
      .select('deleted_at')
      .first()

    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at) {
      throw new BadRequestException(POST_DELETED)
    }

    await this.dbWriter.transaction(async (trx) => {
      const deleted = await trx(LikeEntity.table)
        .where({
          post_id: postId,
          liker_id: userId,
        })
        .delete()
      if (deleted) {
        await trx(PostEntity.table)
          .where('id', postId)
          .decrement('num_likes', 1)
        await trx(CreatorStatEntity.table)
          .where('user_id', userId)
          .decrement('num_likes', 1)
      }
    })
  }
}
