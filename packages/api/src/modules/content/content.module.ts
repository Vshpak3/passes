import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { PostEntity } from '../post/entities/post.entity'
import { ContentService } from './content.service'
import { ContentEntity } from './entities/content.entity'
import { CloudFrontSignerModule } from './signer/cloudfront-signer.module'

@Module({
  imports: [
    MikroOrmModule.forFeature([ContentEntity, PostEntity]),
    CloudFrontSignerModule,
  ],
  controllers: [],
  providers: [ContentService],
})
export class ContentModule {}
