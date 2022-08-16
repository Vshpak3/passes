import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { GetContentDto } from '../content/dto/get-content.dto'
import { ContentEntity } from '../content/entities/content.entity'
import { ContentPostEntity } from '../content/entities/content-post.entity'
import { POST_DELETED, POST_NOT_EXIST } from './constants/errors'
import { CreatePostDto } from './dto/create-post.dto'
import { GetPostDto } from './dto/get-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostEntity } from './entities/post.entity'

@Injectable()
export class PostService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async create(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<CreatePostDto> {
    let trxErr: Error | undefined = undefined
    await this.dbWriter
      .transaction(async (trx) => {
        const postId = uuid.v4()
        const post = {
          id: postId,
          user_id: userId,
          text: createPostDto.text,
        }

        await this.dbWriter(PostEntity.table)
          .insert(post, '*')
          .transacting(trx)
          .catch((err) => {
            this.logger.error(err)
            throw new InternalServerErrorException()
          })

        for (let i = 0; i < createPostDto.content.length; ++i) {
          const createContentDto = createPostDto.content[i]

          const content = {
            user_id: userId,
            url: createContentDto.url,
            content_type: createContentDto.contentType,
          }
          await trx('content').insert(content)

          const contentPost = {
            content_id: contentId,
            post_id: postId,
          }

          await trx('content_post').insert(contentPost)
        }

        for (let i = 0; i < createPostDto.passes.length; ++i) {
          const postRequiredPass = {
            post_id: postId,
            pass_id: createPostDto.passes[i],
          }

          await trx('post_required_pass').insert(postRequiredPass)
        }
      })
      .catch((err) => {
        trxErr = err
        this.logger.error(err)
      })
    if (trxErr) {
      throw new InternalServerErrorException()
    }
    return createPostDto
  }

  async findOne(id: string): Promise<GetPostDto> {
    const postDbResult = await this.dbReader(PostEntity.table)
      .leftJoin(ContentPostEntity.table, 'content_post.post_id', 'post.id')
      .leftJoin(ContentEntity.table, 'content.id', 'content_post.post_id')
      .select(
        'post.id',
        // eslint-disable-next-line sonarjs/no-duplicate-string
        'post.user_id',
        'post.text',
        'post.num_likes',
        'post.num_comments',
        'post.created_at',
        'post.updated_at',
        'content.id as content_id',
        'content.url',
        'content.content_type',
        'post.deleted_at',
      )
      .where('post.id', id)

    if (!postDbResult[0]) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (postDbResult[0].deleted_at) {
      throw new NotFoundException(POST_DELETED)
    }

    const postContent = postDbResult
      .map((postContentRow) => {
        if (
          postContentRow.content_id &&
          postContentRow.url &&
          postContentRow.content_type
        ) {
          return new GetContentDto(
            postContentRow.content_id,
            postContentRow.url,
            postContentRow.content_type,
          )
        } else {
          return undefined
        }
      })
      .filter(
        (postContentDtoOrUndefined) => postContentDtoOrUndefined != undefined,
      )

    return new GetPostDto(
      postDbResult[0].id,
      postDbResult[0].user_id,
      postDbResult[0].text,
      postContent as GetContentDto[],
      postDbResult[0].num_likes,
      postDbResult[0].num_comments,
      postDbResult[0].created_at.toISOString(),
      postDbResult[0].updated_at.toISOString(),
    )
  }

  async update(userId: string, postId: string, updatePostDto: UpdatePostDto) {
    const postDbResult = await this.dbReader(PostEntity.table)
      .select(
        'post.id',
        'post.user_id',
        'post.deleted_at',
        'post.text',
        'post.num_likes',
        'post.num_comments',
        'post.created_at',
        'post.updated_at',
      )
      .where('post.id', postId)
      .where('post.user_id', userId)

    if (!postDbResult[0]) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (postDbResult[0].deletedAt) {
      throw new NotFoundException(POST_DELETED)
    }

    //TODO: actually update post here
    this.logger.info(updatePostDto)

    //TODO: actually update post here
    this.logger.info(updatePostDto)

    return new GetPostDto(
      postDbResult[0].id,
      postDbResult[0].user_id,
      postDbResult[0].text,
      [],
      postDbResult[0].num_likes,
      postDbResult[0].num_comments,
      postDbResult[0].created_at.toISOString(),
      postDbResult[0].updated_at.toISOString(),
    )
  }

  async remove(userId: string, postId: string) {
    const post = await this.dbReader(PostEntity.table)
      .where({ id: postId })
      .first()
    if (!post) {
      throw new NotFoundException(POST_NOT_EXIST)
    }
    return true
  }
}
