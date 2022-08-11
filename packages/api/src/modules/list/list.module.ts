import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { ListEntity } from './entities/list.entity'
import { ListMemberEntity } from './entities/list-member.entity'
import { ListController } from './list.controller'
import { ListService } from './list.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([ListEntity, ListMemberEntity], 'ReadWrite'),
  ],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
