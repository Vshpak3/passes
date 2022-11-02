import { Module } from '@nestjs/common'
import { SentryModule } from '@ntegral/nestjs-sentry'

import { EmailService } from './email.service'

@Module({
  imports: [SentryModule],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
