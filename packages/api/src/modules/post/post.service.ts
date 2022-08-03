import { EntityRepository, wrap } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import * as uuid from 'uuid'

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
    private readonly entityManager: EntityManager,
    @InjectRepository(PostEntity)
    private readonly postRepository: EntityRepository<PostEntity>,
  ) {}

  async create(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<CreatePostDto> {
    const knex = this.entityManager.getKnex()
    knex
      .transaction(async (trx) => {
        const now = new Date()

        const postId = uuid.v4()
        const post = {
          id: postId,
          user_id: userId,
          text: createPostDto.text,
          num_likes: 0,
          num_comments: 0,
          created_at: now,
          updated_at: now,
        }

        await knex
          .insert(post, '*')
          .into('post')
          .transacting(trx)
          .catch((err) => {
            console.log(err)
            throw new InternalServerErrorException()
          })

        for (let i = 0; i < createPostDto.content.length; ++i) {
          const createContentDto = createPostDto.content[i]

          const content = {
            post_id: postId,
            url: createContentDto.url,
            contentType: createContentDto.contentType,
          }
          await trx('content').insert(content)
        }

        for (let i = 0; i < createPostDto.passes.length; ++i) {
          const postRequiredPass = {
            id: uuid.v4(),
            post_id: postId,
            pass_id: createPostDto.passes[i],
            created_at: now,
            updated_at: now,
          }

          await trx('post_required_pass').insert(postRequiredPass)
        }
      })
      .catch((err) => {
        console.log(err)
        throw new InternalServerErrorException()
      })

    return createPostDto
  }

  async findOne(id: string): Promise<GetPostDto> {
    const post = await this.postRepository.findOne(id, {
      populate: ['content'],
    })

    if (!post) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (post.deletedAt) {
      throw new NotFoundException(POST_DELETED)
    }

    return new GetPostDto(post)
  }

  async update(userId: string, postId: string, updatePostDto: UpdatePostDto) {
    const currentPost = await this.postRepository.findOne(postId)

    if (!currentPost) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (currentPost.user.id !== userId) {
      throw new ForbiddenException(POST_NOT_OWNED_BY_USER)
    }

    if (currentPost.deletedAt) {
      throw new NotFoundException(POST_DELETED)
    }

    const newPost = wrap(currentPost).assign({
      ...updatePostDto,
    })

    await this.postRepository.persistAndFlush(newPost)
    return new GetPostDto(newPost)
  }

  async remove(userId: string, postId: string) {
    const post = await this.postRepository.findOne(postId)
    if (!post) {
      throw new NotFoundException(POST_NOT_EXIST)
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException(POST_NOT_OWNED_BY_USER)
    }

    const newPost = wrap(post).assign({
      deletedAt: new Date(),
    })

    await this.postRepository.persistAndFlush(newPost)
    return new GetPostDto(newPost)
  }
}
