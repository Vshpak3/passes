import { Module } from '@nestjs/common'

import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

@Module({
  imports: [],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
