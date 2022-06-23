import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { PostEntity } from './entities/post.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'

@Module({
  imports: [MikroOrmModule.forFeature([PostEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
