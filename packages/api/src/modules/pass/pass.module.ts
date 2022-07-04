import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { PassEntity } from './entities/pass.entity'
import { PassController } from './pass.controller'
import { PassService } from './pass.service'

@Module({
  imports: [MikroOrmModule.forFeature([PassEntity])],
  controllers: [PassController],
  providers: [PassService],
})
export class PassModule {}
