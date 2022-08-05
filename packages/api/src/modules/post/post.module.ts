import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { UserEntity } from '../user/entities/user.entity'
import { PostEntity } from './entities/post.entity'
import { PostRequiredPassEntity } from './entities/postrequiredpass.entity'
import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
  imports: [
    MikroOrmModule.forFeature(
      [PostEntity, PostRequiredPassEntity, UserEntity],
      'ReadWrite',
    ),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
