import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { CreatorStatEntity } from '../creator-stats/entities/creator-stat.entity'
import { POST_DELETED, POST_NOT_EXIST } from '../post/constants/errors'
import { PostEntity } from '../post/entities/post.entity'
import { LikeEntity } from './entities/like.entity'

@Injectable()
export class LikeService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async checkLike(userId: string, postId: string): Promise<boolean> {
    return !!(await this.dbReader<LikeEntity>(LikeEntity.table)
      .where({
        post_id: postId,
        liker_id: userId,
      })
      .select('id')
      .first())
  }

  async likePost(userId: string, postId: string) {
    const post = await this.dbReader<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .select(['user_id', 'deleted_at'])
      .first()
    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at) {
      throw new BadRequestException(POST_DELETED)
    }

    const query = this.dbWriter.transaction(async (trx) => {
      await trx<LikeEntity>(LikeEntity.table).insert({
        post_id: postId,
        liker_id: userId,
      })
      await trx<PostEntity>(PostEntity.table)
        .where({ id: postId })
        .increment('num_likes', 1)
      await trx<CreatorStatEntity>(CreatorStatEntity.table)
        .where({ user_id: post.user_id })
        .increment('num_likes', 1)
    })
    await createOrThrowOnDuplicate(
      () => query,
      this.logger,
      'cant like a post twice',
    )
  }

  async unlikePost(userId: string, postId: string) {
    const post = await this.dbReader<PostEntity>(PostEntity.table)
      .where({ id: postId })
      .select(['user_id', 'deleted_at'])
      .first()

    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at) {
      throw new BadRequestException(POST_DELETED)
    }

    await this.dbWriter.transaction(async (trx) => {
      const deleted = await trx<LikeEntity>(LikeEntity.table)
        .where({
          post_id: postId,
          liker_id: userId,
        })
        .delete()
      if (deleted) {
        await trx<PostEntity>(PostEntity.table)
          .where({ id: postId })
          .decrement('num_likes', 1)
        await trx<CreatorStatEntity>(CreatorStatEntity.table)
          .where({ user_id: post.user_id })
          .decrement('num_likes', 1)
      }
    })
  }
}
