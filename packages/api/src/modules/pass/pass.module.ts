import { Module } from '@nestjs/common'
import { PassService } from './pass.service'
import { PassController } from './pass.controller'
import { Pass } from './entities/pass.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'

@Module({
  imports: [MikroOrmModule.forFeature([Pass])],
  controllers: [PassController],
  providers: [PassService],
})
export class PassModule {}
