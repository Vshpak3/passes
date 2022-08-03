import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { PostEntity } from '../post/entities/post.entity'
import { UserEntity } from '../user/entities/user.entity'
import { FeedController } from './feed.controller'
import { FeedService } from './feed.service'

@Module({
  imports: [MikroOrmModule.forFeature([PostEntity, UserEntity])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
