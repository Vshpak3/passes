import { Module } from '@nestjs/common'

import { LambdaModule } from '../lambda/lambda.module'
import { S3Module } from '../s3/s3.module'
import { SolController } from './sol.controller'
import { SolService } from './sol.service'

@Module({
  imports: [LambdaModule, S3Module],
  controllers: [SolController],
  providers: [SolService],
  exports: [SolService],
})
export class SolModule {}
