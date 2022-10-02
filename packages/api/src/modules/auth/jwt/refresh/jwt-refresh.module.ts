import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { jwtRefreshConfig } from '../jwt.config'
import { JwtRefreshStrategy } from './jwt-refresh.strategy'

@Module({
  imports: [JwtModule.registerAsync(jwtRefreshConfig)],
  controllers: [],
  providers: [JwtRefreshStrategy],
  exports: [],
})
export class JwtRefreshModule {}
