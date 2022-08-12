import { Injectable } from '@nestjs/common'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@Injectable()
export class CommentService {
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
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
