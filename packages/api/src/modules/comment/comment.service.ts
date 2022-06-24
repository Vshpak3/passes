import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'

import { CommentEntity } from './entities/comment.entity'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: EntityRepository<CommentEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<CreateCommentDto> {
    return `TODO: This action adds a new comment ${createCommentDto}`
  }

  async findOne(id: string): Promise<CreateCommentDto> {
    return `TODO: This action returns a #${id} comment`
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    ;`TODO: This action updates a #${id} comment ${updateCommentDto}`
  }

  async remove(id: string) {
    ;`TODO: This action removes a #${id} comment`
  }
}
