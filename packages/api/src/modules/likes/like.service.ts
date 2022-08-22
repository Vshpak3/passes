import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
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

  async create(userId: string, postId: string) {
    const post = await this.dbReader(PostEntity.table)
      .where({ id: postId })
      .first()
    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at !== null) {
      throw new BadRequestException(POST_DELETED)
    }

    const alreadyLikes = await this.dbWriter(LikeEntity.table)
      .where({
        post_id: postId,
        liker_id: userId,
      })
      .first()

    if (alreadyLikes) {
      return
    }

    this.dbWriter.transaction(async (trx) => {
      const data = LikeEntity.toDict<LikeEntity>({
        post: postId,
        liker: userId,
      })

      await trx(LikeEntity.table).insert(data)
      await trx(PostEntity.table).where('id', postId).increment('num_likes', 1)
    })
  }

  async delete(userId: string, postId: string) {
    const post = await this.dbReader(PostEntity.table)
      .where({ id: postId })
      .first()
    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    if (post.deleted_at !== null) {
      throw new BadRequestException(POST_DELETED)
    }

    const alreadyLikes = await this.dbWriter(LikeEntity.table)
      .where({
        post_id: postId,
        liker_id: userId,
      })
      .first()

    if (!alreadyLikes) {
      return
    }

    this.dbWriter.transaction(async (trx) => {
      await trx(LikeEntity.table)
        .where({
          post_id: postId,
          liker_id: userId,
        })
        .delete()
      await trx(PostEntity.table).where('id', postId).decrement('num_likes', 1)
    })
  }
}
