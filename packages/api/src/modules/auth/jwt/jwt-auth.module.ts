import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { JwtAuthService } from './jwt-auth.service'
import { JwtAuthStrategy } from './jwt-auth.strategy'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.authSecret'),
          signOptions: {
            expiresIn: configService.get('jwt.authExpiresIn'),
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [JwtAuthService, JwtAuthStrategy],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
