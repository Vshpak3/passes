import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { UserEntity } from '../user/entities/user.entity'
import { ProfileEntity } from './entities/profile.entity'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

@Module({
  imports: [MikroOrmModule.forFeature([ProfileEntity, UserEntity])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
