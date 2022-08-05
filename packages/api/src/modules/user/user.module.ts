import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { UserEntity } from './entities/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity], 'ReadWrite')],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
