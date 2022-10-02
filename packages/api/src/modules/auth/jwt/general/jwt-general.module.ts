import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { jwtAuthConfig } from '../jwt.config'
import { JwtGeneralStrategy } from './jwt-general.strategy'

@Module({
  imports: [JwtModule.registerAsync(jwtAuthConfig)],
  controllers: [],
  providers: [JwtGeneralStrategy],
  exports: [],
})
export class JwtGeneralModule {}
