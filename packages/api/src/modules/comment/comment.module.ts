import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { CommentEntity } from './entities/comment.entity'

@Module({
  imports: [MikroOrmModule.forFeature([CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
