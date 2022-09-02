import { Module } from '@nestjs/common'

import { JwtAuthModule } from '../auth/jwt/jwt-auth.module'
import { JwtRefreshModule } from '../auth/jwt/jwt-refresh.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { UserModule } from '../user/user.module'
import { AdminController } from './admin.controller'

@Module({
  imports: [JwtAuthModule, JwtRefreshModule, S3ContentModule, UserModule],
  controllers: [AdminController],
  providers: [],
  exports: [],
})
export class AdminModule {}
