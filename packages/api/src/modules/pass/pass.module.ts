import { Module } from '@nestjs/common'
import { PassService } from './pass.service'
import { PassController } from './pass.controller'
import { PassEntity } from './entities/pass.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'

@Module({
  imports: [MikroOrmModule.forFeature([PassEntity])],
  controllers: [PassController],
  providers: [PassService],
})
export class PassModule {}
