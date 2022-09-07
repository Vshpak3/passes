import { Module } from '@nestjs/common'

import { MessagesModule } from '../messages/messages.module'
import { FollowController } from './follow.controller'
import { FollowService } from './follow.service'

@Module({
  imports: [MessagesModule],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
