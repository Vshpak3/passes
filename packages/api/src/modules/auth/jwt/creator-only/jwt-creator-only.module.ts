import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { jwtAuthConfig } from '../jwt.config'
import { JwtCreatorOnlyStrategy } from './jwt-creator-only.strategy'

@Module({
  imports: [JwtModule.registerAsync(jwtAuthConfig)],
  controllers: [],
  providers: [JwtCreatorOnlyStrategy],
  exports: [],
})
export class JwtCreatorOnlyModule {}
