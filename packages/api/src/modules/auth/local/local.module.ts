import { Module } from '@nestjs/common'

import { S3Module } from '../../s3/s3.module'
import { UserModule } from '../../user/user.module'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { JwtRefreshModule } from '../jwt/jwt-refresh.module'
import { LocalAuthController } from './local.controller'
import { LocalAuthService } from './local.service'

@Module({
  imports: [UserModule, JwtAuthModule, JwtRefreshModule, S3Module],
  controllers: [LocalAuthController],
  providers: [LocalAuthService],
  exports: [],
})
export class LocalAuthModule {}
