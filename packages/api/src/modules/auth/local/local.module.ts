import { Module } from '@nestjs/common'

import { EmailModule } from '../../email/email.module'
import { S3ContentModule } from '../../s3content/s3content.module'
import { UserModule } from '../../user/user.module'
import { CoreAuthModule } from '../core/core-auth.module'
import { JwtModule } from '../jwt/jwt.module'
import { LocalAuthController } from './local.controller'
import { LocalAuthService } from './local.service'

@Module({
  imports: [
    CoreAuthModule,
    EmailModule,
    JwtModule,
    S3ContentModule,
    UserModule,
  ],
  controllers: [LocalAuthController],
  providers: [LocalAuthService],
  exports: [],
})
export class LocalAuthModule {}
