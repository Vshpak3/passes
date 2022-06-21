import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'

import { Post } from './entities/post.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: EntityRepository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<string> {
    return 'TODO: This action adds a new post'
  }

  async findAll(): Promise<string> {
    return `TODO: This action returns all post`
  }

  async findOne(id: string): Promise<string> {
    return `TODO: This action returns a #${id} post`
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    ;`TODO: This action updates a #${id} post`
  }

  async remove(id: string) {
    ;`TODO: This action removes a #${id} post`
  }
}
