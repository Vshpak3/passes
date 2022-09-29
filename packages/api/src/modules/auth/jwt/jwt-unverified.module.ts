import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { JwtUnverifiedStrategy } from './jwt-unverified.strategy'

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
  providers: [JwtUnverifiedStrategy],
  exports: [],
})
export class JwtUnverifiedModule {}
