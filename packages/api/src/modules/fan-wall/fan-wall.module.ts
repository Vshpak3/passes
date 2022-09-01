import { Module } from '@nestjs/common'

import { FanWallController } from './fan-wall.controller'
import { FanWallService } from './fan-wall.service'

@Module({
  imports: [],
  controllers: [FanWallController],
  providers: [FanWallService],
  exports: [FanWallService],
})
export class FanWallModule {}
