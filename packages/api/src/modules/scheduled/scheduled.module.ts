import { Module } from '@nestjs/common'

import { ContentModule } from '../content/content.module'
import { ListModule } from '../list/list.module'
import { MessagesModule } from '../messages/messages.module'
import { PassModule } from '../pass/pass.module'
import { PostModule } from '../post/post.module'
import { ScheduledController } from './scheduled.controller'
import { ScheduledService } from './scheduled.service'

@Module({
  imports: [PostModule, MessagesModule, PassModule, ListModule, ContentModule],
  controllers: [ScheduledController],
  providers: [ScheduledService],
  exports: [ScheduledService],
})
export class ScheduledModule {}
