import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { jwtAuthConfig } from '../jwt.config'
import { JwtUnverifiedStrategy } from './jwt-unverified.strategy'

@Module({
  imports: [JwtModule.registerAsync(jwtAuthConfig)],
  controllers: [],
  providers: [JwtUnverifiedStrategy],
  exports: [],
})
export class JwtUnverifiedModule {}
