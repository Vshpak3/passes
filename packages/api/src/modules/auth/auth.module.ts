import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from './../user/user.module'
import { AuthController } from './auth.controller'
import { GoogleOauthModule } from './google/google-oauth-module'
import { JwtAuthModule } from './jwt/jwt-auth.module'

@Module({
  imports: [UserModule, PassportModule, GoogleOauthModule, JwtAuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
