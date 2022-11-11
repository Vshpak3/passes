import { Module } from '@nestjs/common'

import { EmailModule } from '../email/email.module'
import { FanWallController } from './fan-wall.controller'
import { FanWallService } from './fan-wall.service'

@Module({
  imports: [EmailModule],
  controllers: [FanWallController],
  providers: [FanWallService],
  exports: [FanWallService],
})
export class FanWallModule {}
