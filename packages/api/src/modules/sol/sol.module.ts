import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { LambdaService } from '../lambda/lambda.service'
import { S3Service } from '../s3/s3.service'
import { SolController } from './sol.controller'
import { SolService } from './sol.service'

@Module({
  controllers: [SolController],
  providers: [SolService, LambdaService, ConfigService, S3Service],
})
export class SolModule {}
