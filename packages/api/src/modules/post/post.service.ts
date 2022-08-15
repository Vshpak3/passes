import {
  ForbiddenException,
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
import { ContentEntity } from '../content/entities/content.entity'
import {
  POST_DELETED,
  POST_NOT_EXIST,
  POST_NOT_OWNED_BY_USER,
} from './constants/errors'
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
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {}

  async create(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<CreatePostDto> {
    const { knex } = this.ReadWriteDatabaseService
    knex
      .transaction(async (trx) => {
        const postId = uuid.v4()
        const post = {
          id: postId,
          user_id: userId,
          text: createPostDto.text,
        }

        await knex
          .insert(post, '*')
          .into('post')
          .transacting(trx)
          .catch((err) => {
            this.logger.error(err)
            throw new InternalServerErrorException()
          })

        for (let i = 0; i < createPostDto.content.length; ++i) {
          const contentId = uuid.v4()
          const createContentDto = createPostDto.content[i]

          const content = {
            id: contentId,
            post_id: postId,
            url: createContentDto.url,
            content_type: createContentDto.contentType,
          }
          await trx('content').insert(content)
        }

        for (let i = 0; i < createPostDto.passes.length; ++i) {
          const postRequiredPass = {
            id: uuid.v4(),
            post_id: postId,
            pass_id: createPostDto.passes[i],
          }

          await trx('post_required_pass').insert(postRequiredPass)
        }
      })
      .catch((err) => {
        this.logger.error(err)
        throw new InternalServerErrorException()
      })

    return createPostDto
  }

  async findOne(id: string): Promise<GetPostDto> {
    const { knex } = this.ReadOnlyDatabaseService
    const [post, content] = await Promise.all([
      knex(PostEntity.table)
        .where({
          id,
        })
        .first(),
      knex(ContentEntity.table).where(
        ContentEntity.toDict<ContentEntity>({
          post: id,
        }),
      ),
    ])

    if (!post) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (post.deletedAt) {
      throw new NotFoundException(POST_DELETED)
    }

    return new GetPostDto({ ...post, content })
  }

  async update(userId: string, postId: string, updatePostDto: UpdatePostDto) {
    const { knex } = this.ReadWriteDatabaseService
    const currentPost = await knex(PostEntity.table)
      .where({ id: postId })
      .first()

    if (!currentPost) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (currentPost.user_id !== userId) {
      throw new ForbiddenException(POST_NOT_OWNED_BY_USER)
    }

    if (currentPost.deleted_at) {
      throw new NotFoundException(POST_DELETED)
    }

    const data = PostEntity.toDict<PostEntity>(updatePostDto)
    await knex(PostEntity.table).update(data).where({ id: postId })
    return new GetPostDto({ ...currentPost, ...data })
  }

  async remove(userId: string, postId: string) {
    const { knex } = this.ReadWriteDatabaseService
    const post = await knex(PostEntity.table).where({ id: postId }).first()
    if (!post) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException(POST_NOT_OWNED_BY_USER)
    }

    const data = PostEntity.toDict<PostEntity>({ deletedAt: new Date() })
    await knex(PostEntity.table).update(data).where({ id: postId })
    return new GetPostDto({ ...post, ...data })
  }
}
