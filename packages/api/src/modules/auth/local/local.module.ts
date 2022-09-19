import { Module } from '@nestjs/common'

import { EmailModule } from '../../email/email.module'
import { S3ContentModule } from '../../s3content/s3content.module'
import { UserModule } from '../../user/user.module'
import { CoreAuthModule } from '../core/core-auth.module'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { JwtRefreshModule } from '../jwt/jwt-refresh.module'
import { LocalAuthController } from './local.controller'
import { LocalAuthService } from './local.service'

@Module({
  imports: [
    CoreAuthModule,
    UserModule,
    EmailModule,
    JwtAuthModule,
    JwtRefreshModule,
    S3ContentModule,
  ],
  controllers: [LocalAuthController],
  providers: [LocalAuthService],
  exports: [],
})
export class LocalAuthModule {}
