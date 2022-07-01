import { Module } from '@nestjs/common'
import { GoogleOauthController } from './google-oauth.controller'
import { GoogleOauthStrategy } from './google-oauth.strategy'
import { JwtAuthModule } from '../jwt/jwt-auth.module'
import { UserModule } from '../../user/user.module'

@Module({
  imports: [UserModule, JwtAuthModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthStrategy],
})
export class GoogleOauthModule {}
