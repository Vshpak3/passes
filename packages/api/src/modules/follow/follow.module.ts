import { forwardRef, Module } from '@nestjs/common'

import { MessagesModule } from '../messages/messages.module'
import { PostModule } from '../post/post.module'
import { FollowController } from './follow.controller'
import { FollowService } from './follow.service'

@Module({
  imports: [forwardRef(() => MessagesModule), PostModule],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
