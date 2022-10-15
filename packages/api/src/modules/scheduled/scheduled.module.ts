import { Module } from '@nestjs/common'

import { MessagesModule } from '../messages/messages.module'
import { PostModule } from '../post/post.module'
import { ScheduledController } from './scheduled.controller'
import { ScheduledService } from './scheduled.service'

@Module({
  imports: [PostModule, MessagesModule],
  controllers: [ScheduledController],
  providers: [ScheduledService],
  exports: [ScheduledService],
})
export class ScheduledModule {}
