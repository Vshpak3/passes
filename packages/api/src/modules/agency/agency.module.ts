import { Module } from '@nestjs/common'

import { AgencyController } from './agency.controller'
import { AgencyService } from './agency.service'

@Module({
  imports: [],
  controllers: [AgencyController],
  providers: [AgencyService],
  exports: [],
})
export class AgencyModule {}
