import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { ContentService } from './content.service'
import { ContentEntity } from './entities/content.entity'

@Module({
  imports: [MikroOrmModule.forFeature([ContentEntity])],
  controllers: [],
  providers: [ContentService],
})
export class PassModule {}
