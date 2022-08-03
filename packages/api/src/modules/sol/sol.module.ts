import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { LambdaService } from '../lambda/lambda.service'
import { UserEntity } from '../user/entities/user.entity'
import { SolNftCollectionEntity } from './entities/sol-nft-collection.entity'
import { SolController } from './sol.controller'
import { SolService } from './sol.service'

@Module({
  imports: [MikroOrmModule.forFeature([SolNftCollectionEntity, UserEntity])],
  controllers: [SolController],
  providers: [SolService, LambdaService],
})
export class SolModule {}
