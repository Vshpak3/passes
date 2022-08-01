import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { JwtAuthService } from './jwt-auth.service'
import { JwtAuthStrategy } from './jwt-auth.strategy'
import { JwtRefreshStrategy } from './jwt-refresh.strategy'
import { JwtVerifiedStrategy } from './jwt-verified.strategy'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: configService.get('jwt.expiresIn'),
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtAuthStrategy,
    JwtRefreshStrategy,
    JwtVerifiedStrategy,
    JwtAuthService,
  ],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
