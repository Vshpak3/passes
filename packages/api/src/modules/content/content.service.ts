import { EntityRepository, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { PostEntity } from '../post/entities/post.entity'
import { CONTENT_NOT_EXIST, POST_NOT_EXIST } from './constants/errors'
import { CreateContentDto } from './dto/create-content.dto'
import { GetContentDto } from './dto/get-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { ContentEntity } from './entities/content.entity'

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepository: EntityRepository<ContentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: EntityRepository<PostEntity>,
  ) {}

  async create(
    postId: string,
    createContentDto: CreateContentDto,
  ): Promise<GetContentDto> {
    const post = await this.postRepository.getReference(postId)

    if (!post) {
      throw new BadRequestException(POST_NOT_EXIST)
    }

    try {
      const content = this.contentRepository.create({
        post,
        url: createContentDto.url,
        contentType: createContentDto.contentType,
      })

      await this.contentRepository.persistAndFlush(content)
      return new GetContentDto(content)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: string): Promise<GetContentDto> {
    const content = await this.contentRepository.findOne(id)
    if (!content) {
      throw new NotFoundException(CONTENT_NOT_EXIST)
    }

    return new GetContentDto(content)
  }

  async update(
    contentId: string,
    updateContentDto: UpdateContentDto,
  ): Promise<GetContentDto> {
    const currentProfile = await this.contentRepository.findOne(contentId)

    if (!currentProfile) {
      throw new NotFoundException(CONTENT_NOT_EXIST)
    }

    const newContent = wrap(currentProfile).assign({
      ...updateContentDto,
    })

    await this.contentRepository.persistAndFlush(newContent)
    return new GetContentDto(newContent)
  }
}
