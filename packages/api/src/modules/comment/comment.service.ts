import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'

import { Comment } from './entities/comment.entity'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<CreateCommentDto> {
    return 'TODO: This action adds a new comment'
  }

  async findOne(id: string): Promise<CreateCommentDto> {
    return `TODO: This action returns a #${id} comment`
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    ;`TODO: This action updates a #${id} comment`
  }

  async remove(id: string) {
    ;`TODO: This action removes a #${id} comment`
  }
}
