import { Module } from '@nestjs/common'

import { LambdaService } from './lambda.service'

@Module({
  imports: [],
  providers: [LambdaService],
  exports: [LambdaService],
})
export class LambdaModule {}
