import { Module } from '@nestjs/common'

import { EmailModule } from '../email/email.module'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'

@Module({
  imports: [EmailModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
