import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'

import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostEntity } from './entities/post.entity'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: EntityRepository<PostEntity>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<string> {
    return `TODO: This action adds a new post ${createPostDto}`
  }

  async findAll(): Promise<string> {
    return `TODO: This action returns all post`
  }

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} post`
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    ;`TODO: This action updates a #${id} post ${updatePostDto}`
  }

  async remove(id: string) {
    ;`TODO: This action removes a #${id} post`
  }
}
