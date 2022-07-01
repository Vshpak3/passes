import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { JwtAuthModule } from './jwt/jwt-auth.module'
import { GoogleOauthModule } from './google/google-oauth-module'
import { UserModule } from './../user/user.module'

@Module({
  imports: [UserModule, PassportModule, GoogleOauthModule, JwtAuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
