import { Module } from '@nestjs/common'

import { PostModule } from '../post/post.module'
import { FeedController } from './feed.controller'
import { FeedService } from './feed.service'

@Module({
  imports: [PostModule],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
