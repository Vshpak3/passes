import { Module } from '@nestjs/common'

import { FollowModule } from '../follow/follow.module'
import { ListController } from './list.controller'
import { ListService } from './list.service'

@Module({
  imports: [FollowModule],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}
