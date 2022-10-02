import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { jwtAuthConfig } from '../jwt.config'
import { JwtNoAuthStrategy } from './jwt-no-auth.strategy'

@Module({
  imports: [JwtModule.registerAsync(jwtAuthConfig)],
  controllers: [],
  providers: [JwtNoAuthStrategy],
  exports: [],
})
export class JwtNoAuthModule {}
